import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) { }

  async createToken(id: string, email: string) {
    const expiresIn = 60 * 60;
    const secretOrKey = 'secret';
    const user = { email };
    const token = jwt.sign(user, secretOrKey, { expiresIn });

    return { expires_in: expiresIn, token };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.userService.getUserByEmail(payload.email);
  }

}