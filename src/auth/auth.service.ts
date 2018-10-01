import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import * as  _ from 'lodash';

import { Injectable } from '@nestjs/common';
import { UsersService } from 'users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async createToken(id: string, email: string) {

    const created_at = moment().valueOf();
    const tokens = [];
    let build;

    // ACCESS TOKEN DEFINITION
    let expires_in = +process.env.TOKEN_LIFE;
    let expires_at = created_at + expires_in;
    let secretOrKey = process.env.JWT_TOKEN_SECRET;
    const user = { email };
    let access = 'auth';
    let token = jwt.sign({user, access}, secretOrKey, { expiresIn: expires_in });
    const User = await this.userService.getUserByEmail(user.email);
    tokens.push({access, token, expires_in, created_at, expires_at});

    // EVALUATE REFRESH TOKEN DEFINITION IS NECCESSARY
    const existingRefreshToken = (_.find(User.tokens, (obj) => obj.access === 'refresh' ));
    if (existingRefreshToken) {
      if (created_at < existingRefreshToken.expires_at){
        build = false;
      } else {
        build = true;
      }
    }else{
      build = true;
    }

    if (build) {
    // REFRESH TOKEN DEFINITION
      expires_in = +process.env.REFRESH_TOKEN_LIFE;
      expires_at = created_at + +expires_in;
      access = 'refresh';
      secretOrKey = process.env.JWT_REFRESH_TOKEN_SECRET;
      token = jwt.sign({user, access}, secretOrKey, { expiresIn: expires_in });
      tokens.push({access, token, expires_in, created_at, expires_at});
    } else {
      tokens.push(existingRefreshToken);
    }

    tokens.forEach( (item) => {
      _.remove(User.tokens, item2 => item2.access === item.access);
      User.tokens.push(item);
    });

    await this.userService.update(User._id, User);

    return { tokens };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.userService.getUserByEmail(payload.email);
  }

  async validateUserByToken(token: string): Promise<any> {
    console.log('VALIDANDO EL TOKEN DEL USUARIO CON EL TOKEN: ', token);
    return await this.userService.getUserByToken(token);
  }

}