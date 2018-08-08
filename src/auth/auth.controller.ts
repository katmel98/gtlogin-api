import { Controller, Post, HttpStatus, Response, Body, Param,
  UnprocessableEntityException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import {LoginUserDto} from './dto/login-user.dto';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { CreateUserDto } from 'users/dto/create-user.dto';

@ApiUseTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService) {}

  @Post('login')
  async loginUser(@Response() res: any, @Body() body: LoginUserDto) {
    if (!(body && body.email && body.password)) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username and password are required!' });
    }

    const user = await this.userService.getUserByEmail(body.email);

    if (user) {
      if (await this.userService.compareHash(body.password, user.password)) {
        return res.status(HttpStatus.OK).json(await this.authService.createToken(user.id, user.email));
      }
    }

    return res.status(HttpStatus.FORBIDDEN).json({ message: 'Username or password wrong!' });
  }

  @Post('register')
  async registerUser(@Body() body: CreateUserDto) {
    try{
        return await this.userService.create(body);
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
  async logoutUser(@Param('token') token: string) {

  }
}