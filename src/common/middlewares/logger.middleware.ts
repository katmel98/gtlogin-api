import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

export function logger(req, res, next) {
    const now = moment().format('YYYY-MM-DD HH:mm.ss');
    const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let requestInfo = now +
                        '; IP_ADDRESS: ' +
                        ip_address +
                        '; METHOD: ' +
                        req.method + ' ' + req.originalUrl;
    if (!(_.isEmpty(req.params))) {
        requestInfo = requestInfo +
                      '; PARAMS: ' +
                      req.JSON.stringify(req.params);
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
