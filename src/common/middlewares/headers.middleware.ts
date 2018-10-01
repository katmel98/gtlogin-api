import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import * as  _ from 'lodash';

import { NestMiddleware, Injectable, MiddlewareFunction, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'users/interfaces/user.interface';
import { Model } from 'mongoose';
import { AuthService } from './../../auth/auth.service';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {

  constructor(@InjectModel('User') private readonly userModel: Model<User>, private authService: AuthService) {}

  async resolve(): Promise<MiddlewareFunction>  {
    return async (req, res, next) => {
        let decoded;
        let generate_auth_token = false;

        const now = moment().valueOf();

        console.log('EJECUTADO EL MIDDLEWARE HEADER');

        const token = _.replace(req.headers.authorization, 'bearer ', '');

        try {
            decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        } catch (e) {
            // return new Promise((resolve, reject) => {
            //     reject();
            // });
            console.log(e.name);
            if (e.name === 'JsonWebTokenError') {
                if (e.message === 'jwt must be provided') {
                    const error = {
                        statusCode: '401',
                        error: 'FORBIDDEN',
                        message: 'Token is required',
                    };
                    return res.status(HttpStatus.FORBIDDEN).json(error);
                }
            }
            return Promise.reject();
        }
        const result = await this.userModel.findOne({
            'email': decoded.user.email,
            'tokens.access': 'auth',
            'tokens.token': token,
        });

        const user = _.pick(result, ['_id', 'email', 'roles', 'last_login', 'tokens']);

        const auth_token = _.find(user.tokens, (obj) => obj.access === 'auth');
        const refresh_token = _.find(user.tokens, (obj) => obj.access === 'refresh');

        console.log('EJECUTADO DESDE HEADER MIDDLEWARE');
        console.log('AUTH_TOKEN');
        console.log(auth_token);
        console.log('REFRESH_TOKEN');
        console.log(refresh_token);

        if (auth_token) {
            if (now > auth_token.expires_at) {
                console.log('*** EL TOKEN YA HA EXPIRADO ***');
                generate_auth_token = true;
            } else {
                console.log('*** EL TOKEN NO HA EXPIRADO TODAVIA ***');
                console.log('*** EL TOKEN EXPIRARA A LAS: ', moment(auth_token.expires_at).format());
                console.log('*** TIEMPO ACTUAL: ', moment(now).format());
            }
        } else {
            generate_auth_token = true;
        }

        if (generate_auth_token) {
            if (refresh_token) {
                console.log('EL REFRESH_TOKEN EXISTE');
                if (now > refresh_token.expires_at) {
                    console.log('*** EL TOKEN YA HA EXPIRADO ***');
                    const error = {
                        statusCode: '401',
                        error: 'FORBIDDEN',
                        message: 'It\'s neccesary to login in order to continue.',
                    };
                    return res.status(HttpStatus.FORBIDDEN).json(error);
                } else {
                    if (user) {
                        return res.status(HttpStatus.OK).json(await this.authService.createToken(user._id, user.email));
                    }
                }
            } else {
                const error = {
                    statusCode: '401',
                    error: 'FORBIDDEN',
                    message: 'It\'s neccesary to login in order to continue.',
                };
                return res.status(HttpStatus.FORBIDDEN).json(error);
            }
        }
        req.headers.user = user;
        // console.log(req.headers.user);
        next();
    };
  }
}
