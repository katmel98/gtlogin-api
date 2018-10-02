import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

import * as jwt from 'jsonwebtoken';
import { HttpStatus } from '@nestjs/common';

export function logger(req, res, next) {
    const now = moment().format('YYYY-MM-DD HH:mm.ss');
    const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const token = _.replace(req.headers.authorization, 'bearer ', '');
    let user;
    if ( token ) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
            user = decoded.user.email;
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
        }
    } else {
        user = 'invited';
    }

    let requestInfo = now +
                        '; IP_ADDRESS: ' +
                        ip_address +
                        '; USER: ' +
                        user +
                        '; METHOD: ' +
                        req.method + ' ' + req.originalUrl;
    const keys = Object.keys(req.params);
    const count = keys.length;
    if ((!(_.isEmpty(req.params))) && (count > 1)) {
        requestInfo = requestInfo +
                      '; PARAMS: ' +
                        JSON.stringify(req.params);
    }
    if (!(_.isEmpty(req.body))) {
        requestInfo = requestInfo +
                      '; BODY: ' +
                      JSON.stringify(req.body);
    }

    console.log(requestInfo);
    fs.appendFile(path.join(__dirname, '../../../logs/api.log'),
    requestInfo + '\n', (err) => {
        if (err){
            console.log('Unable to append to server.log!');
        }
    });
    next();
}
