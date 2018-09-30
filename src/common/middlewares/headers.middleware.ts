import * as _ from 'lodash';
import { NestMiddleware, Injectable, MiddlewareFunction } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'users/interfaces/user.interface';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async resolve(): Promise<MiddlewareFunction>  {
    return async (req, res, next) => {
        let decoded;
        const token = _.replace(req.headers['authorization'], 'bearer ', '');

        try {
            decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        } catch (e) {
            // return new Promise((resolve, reject) => {
            //     reject();
            // });
            console.log(e);
            return Promise.reject();
        }
        const result = await this.userModel.findOne({
            'email': decoded.user.email,
            'tokens.access': 'auth',
            'tokens.token': token,
        });

        const user = _.pick(result, ['_id', 'email', 'roles', 'last_login']);

        req.headers['user'] = user;
        // console.log(req.headers.user);
        next();
    };
  }
}
