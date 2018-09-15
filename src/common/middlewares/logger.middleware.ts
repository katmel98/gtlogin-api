import * as moment from 'moment';

export function logger(req, res, next) {

    const now = moment().format('YYYY-MM-DD HH:mm.ss');
    const requestInfo = now +
                        '; METHOD: ' +
                        req.method +
                        ' ' +
                        req.originalUrl +
                        '; PARAMS: ' +
                        JSON.stringify(req.params) +
                        '; BODY: ' +
                        JSON.stringify(req.body);

    console.log(requestInfo);
    next();
}
