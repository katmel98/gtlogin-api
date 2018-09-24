import { Controller, Post, HttpStatus, Response, Body, Param, Request,
  UnprocessableEntityException, BadRequestException, InternalServerErrorException, UseGuards, NotFoundException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse, ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from 'users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import * as _ from 'lodash';

@ApiUseTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService) {}

  @Post('login')
  @ApiOperation({ title: 'Login a user with username/email and password.'})
  @ApiResponse({ status: 200, description: 'The user is loggedin.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async loginUser(@Response() res: any, @Body() body: LoginUserDto) {
    if (!(body && body.email && body.password)) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username and password are required!' });
    }

    const user = await this.usersService.getUserByEmail(body.email);

    if (user) {
      res.set('user', user);
      if (await this.usersService.compareHash(body.password, user.password)) {
        return res.status(HttpStatus.OK).json(await this.authService.createToken(user['id'], user.email));
      }
    }

    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username or password wrong!' });
  }

  @Post('register')
  @ApiOperation({ title: 'Registers a new user.'})
  @ApiResponse({ status: 200, description: 'The user has been created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async registerUser(@Body() body: CreateUserDto) {
    try{
        return await this.usersService.create(body);
    } catch (e) {
      const message = e.message;
      if ( e.name === 'ValidationError' ){
          throw new UnprocessableEntityException(message);
      }else if ( e.name === 'MongoError' ){
          throw new BadRequestException(message);
      } else {
          throw new InternalServerErrorException();
      }
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard('bearer'))
  @ApiOperation({ title: 'Logout a user.'})
  @ApiResponse({ status: 200, description: 'The user has been logout.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async logout(@Req() request: Request): Promise<any> {
    // return `This action removes a #${id} user`;
    const token = _.replace(request.headers['authorization'], 'Bearer ', '');
    try {
        return await this.usersService.removeToken(token);
    } catch (e){
        const message = e.message;
        if ( e.message.error === 'NOT_FOUND'){
            throw new NotFoundException(message);
        } else if ( e.message.error === 'TOKEN_NOT_VALID'){
            throw new BadRequestException(message);
        }
    }
  }

  @Post('logout/:token')
  @UseGuards(AuthGuard('bearer'))
  @ApiOperation({ title: 'Logout a user with access token.'})
  @ApiResponse({ status: 200, description: 'The user has been logout.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async removeToken(@Param('token') token: string): Promise<any> {
    // return `This action removes a #${id} user`;
    try {
        return await this.usersService.removeToken(token);
    } catch (e){
        const message = e.message;
        if ( e.message.error === 'NOT_FOUND'){
            throw new NotFoundException(message);
        } else if ( e.message.error === 'TOKEN_NOT_VALID'){
            throw new BadRequestException(message);
        }
    }
  }

}