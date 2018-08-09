import { Controller, Post, HttpStatus, Response, Body, Param,
  UnprocessableEntityException, BadRequestException, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse, ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from 'users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiUseTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService) {}

  @Post('login')
  @ApiOperation({ title: 'Login a user with username/email and password.'})
  @ApiResponse({ status: 200, description: 'The user is loggedin.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
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
  @ApiOperation({ title: 'Registers a new user.'})
  @ApiResponse({ status: 200, description: 'The user has been created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
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
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ title: 'Logout a user with access token.'})
  @ApiResponse({ status: 200, description: 'The user has been logout.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  async logoutUser(@Param('token') token: string) {
    return 'Logged out';
  }
}