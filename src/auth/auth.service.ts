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

    const now = moment().valueOf();
    const created_at = now;
    const tokens = [];
    let build;
    const debug = process.env.DEBUG;

    // ACCESS TOKEN DEFINITION
    let expires_in = +process.env.TOKEN_LIFE * 1000; // Tiempo programado como segundos a milisegundos
    let expires_at = now + expires_in;
    let secretOrKey = process.env.JWT_TOKEN_SECRET;
    const user = { email };
    let access = 'auth';
    let token = jwt.sign({user, access}, secretOrKey, { expiresIn: expires_in });
    const User = await this.userService.getUserByEmail(user.email);
    tokens.push({access, token, expires_in, created_at, expires_at});

    // EVALUATE REFRESH TOKEN DEFINITION IS NECCESSARY
    const existingRefreshToken = (_.find(User.tokens, (obj) => obj.access === 'refresh' ));

    if (existingRefreshToken) {
      if (debug) console.log('EL REFRESH TOKEN SI EXISTE');
      if (created_at < existingRefreshToken.expires_at){
        if (debug) console.log('TODAVIA FALTA PARA QUE EXPIRE EL TOKEN');
        build = false;
      } else {
        if (debug) console.log('HA EXPIRADO EL TOKEN');
        build = true;
      }
    }else{
      if (debug) console.log('EL REFRESH TOKEN NO EXISTE');
      build = true;
    }

    if (build) {
    // REFRESH TOKEN DEFINITION
      expires_in = +process.env.REFRESH_TOKEN_LIFE * 1000; // Tiempo programado como segundos a milisegundos
      expires_at = now + +expires_in;
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

    User.logged_in = true;
    User.last_login = now;
    await this.userService.update(User._id, User);

    return { tokens };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.userService.getUserByEmail(payload.email);
  }

  async validateUserByToken(token: string): Promise<any> {
    return await this.userService.getUserByToken(token);
  }

  async removeToken(token: string): Promise<any> {
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        console.log(e);
        return Promise.reject();
    }
    const User = await this.userService.getUserByEmail(decoded.user.email);
    _.remove(User.tokens, item => item.token === token);

    await this.userService.update(User._id, User);

    return { User };
  }

}