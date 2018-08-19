import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async createToken(id: string, email: string) {
    const expiresIn = 60 * 60;
    const secretOrKey = process.env.JWT_SECRET;
    const user = { email };
    const access = 'auth';
    const token = jwt.sign({user, access}, secretOrKey, { expiresIn });
    const User = await this.userService.getUserByEmail(user.email);

    User.tokens.push({access, token});

    await this.userService.update(User._id, User);

    return { expires_in: expiresIn, token };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.userService.getUserByEmail(payload.email);
  }

  async validateUserByToken(token: string): Promise<any> {
    return await this.userService.getUserByToken(token);
  }

}