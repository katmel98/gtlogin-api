import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import * as  _ from 'lodash';

import { NestMiddleware, Injectable, MiddlewareFunction, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'users/interfaces/user.interface';
import { Model } from 'mongoose';
import { AuthService } from './../../auth/auth.service';
import { UsersService } from 'users/users.service';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {

  constructor(@InjectModel('User') private readonly userModel: Model<User>,
              private authService: AuthService,
              private usersService: UsersService) {}

  async resolve(): Promise<MiddlewareFunction>  {
    return async (req, res, next) => {
        let decoded;
        let generate_auth_token = false;
        const debug = JSON.parse(process.env.DEBUG);

        const now = moment().valueOf();

        // if (debug) console.log('EJECUTADO EL MIDDLEWARE HEADER');

        const token = _.replace(req.headers.authorization, 'bearer ', '');
        // if (debug) console.log('*** EL TOKEN A EVALUAR ES ***');
        // if (debug) console.log(token);

        try {
            decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        } catch (e) {
            // return new Promise((resolve, reject) => {
            //     reject();
            // });
            // if (debug)  console.log(e.name);
            let error;
            if (e.name === 'JsonWebTokenError') {
                if (e.message === 'jwt must be provided') {
                    error = {
                        statusCode: '401',
                        error: 'FORBIDDEN',
                        message: 'Token is required',
                    };
                } else if (e.message === 'jwt malformed') {
                    error = {
                        statusCode: '401',
                        error: 'FORBIDDEN',
                        message: 'Token is not valid',
                    };
                }
                return res.status(HttpStatus.FORBIDDEN).json(error);

            }
            return Promise.reject();
        }
        // const result = await this.userModel.findOne({
        //     'email': decoded.user.email,
        //     'tokens.access': 'auth',
        //     'tokens.token': token,
        // });

        const result = await this.userModel.findOne({
            'email': decoded.user.email,
        });

        const user = _.pick(result, ['_id', 'email', 'roles', 'groups', 'last_login', 'logged_in']);
        user.last_login = moment(user.last_login).toDate().toString();
        const tokens = _.pick(result, ['tokens']);

        // console.log('*** LOS TOKENS ***');
        // console.log(tokens);

        const auth_token = _.find(tokens.tokens, (obj) => obj.access === 'auth');
        const refresh_token = _.find(tokens.tokens, (obj) => obj.access === 'refresh');

        // if (debug) {
        //     console.log('EJECUTADO DESDE HEADER MIDDLEWARE');
        //     console.log('AUTH_TOKEN');
        //     console.log(auth_token);
        //     console.log('REFRESH_TOKEN');
        //     console.log(refresh_token);
        // }

        if (auth_token) {
            if (now > auth_token.expires_at) {
                // if (debug) console.log('*** EL TOKEN YA HA EXPIRADO ***');
                generate_auth_token = true;
            } else {
                // if (debug) {
                //     console.log('*** EL TOKEN NO HA EXPIRADO TODAVIA ***');
                //     console.log('*** EL TOKEN EXPIRARA A LAS: ', moment(auth_token.expires_at).format());
                //     console.log('*** TIEMPO ACTUAL: ', moment(now).format());
                // }
            }
        } else {
            // if (debug) console.log('ES NECESARIO GENERAR EL AUTH_TOKEN');
            generate_auth_token = true;
        }

        if (generate_auth_token) {
            if (refresh_token) {
                // if (debug) console.log('EL REFRESH_TOKEN EXISTE');
                if (now > refresh_token.expires_at) {
                    // SI HA EXPIRADO ES NECESARIO SOLICITAR EL LOGIN
                    // if (debug) console.log('*** EL REFRESH TOKEN YA HA EXPIRADO ***');
                    const error = {
                        statusCode: '401',
                        error: 'FORBIDDEN',
                        message: 'It\'s neccesary to login in order to continue.',
                    };
                    return res.status(HttpStatus.FORBIDDEN).json(error);
                } else {
                    if ( user ) {
                        if ( user.logged_in ) {
                            // if (debug) console.log('*** GENERANDO EL REFRESH TOKEN ***');
                            return res.status(HttpStatus.OK).json(await this.authService.createToken(user._id, user.email));
                        } else {
                            const error = {
                                statusCode: '401',
                                error: 'FORBIDDEN',
                                message: 'It\'s neccesary to login in order to continue.',
                            };
                            return res.status(HttpStatus.FORBIDDEN).json(error);
                        }
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

        // user['permissions'] = [
        //     {resource: 'products', effect: 'allow', method: 'create'},
        //     {resource: 'products', effect: 'allow', method: 'query'},
        // ];

        // user['permissions'] = [
        //     {resource: 'products', method: 'create'},
        //     {resource: 'products', method: 'query'},
        //     {resource: 'roles', method: 'query'},
        //     {resource: 'users', method: '*'},
        // ];

        await this.usersService.findUserPermissionsById(user._id)
            .then( ( item ) => {
                if ( debug ) console.log('*** PERMISSIONS ***');
                if ( debug ) console.log(item);
                user['permissions'] = item;
                req.headers.user = user;
                // if (debug) console.log('*** LLAMADA DESDE EL HEADERS_MIDDLEWARE ***');
                // if (debug) console.log(req.headers.user);
                next();
            })
            .catch( (e) => {
                next();
            });

    };
  }
}
