import { Controller, Post, HttpStatus, Response, Body } from '@nestjs/common';
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
  async registerUser(@Response() res: any, @Body() body: CreateUserDto) {
    if (!(body && body.email && body.password)) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Email and password are required!' });
    }

    let user = await this.userService.getUserByEmail(body.email);

    if (user) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'Email exists' });
    } else {
      user = await this.userService.create(body);
    }

    return res.status(HttpStatus.OK).json(user);
  }
}