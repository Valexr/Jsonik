import qs from 'querystring';
import type { Next, Req, Res } from "../types";

export function url(req: Req, res: Res, next: Next) {
    const parts = new URL(req.url, `http://${req.headers.host}`);
    req.path = parts.pathname;
    req.host = parts.host;
    req.hostname = parts.hostname;
    req.port = parts.port;
    req.search = parts.search;
    req.query = qs.parse(req.search.substring(1))
    next();
}

export function json(req: Req, res: Res, next: Next) {
    if (req.headers['content-type'] === 'application/json') {
        let data = '';

        req.on('data', chunk => {
            data += chunk;
        })

        req.on('end', () => {
            try {
                req.body = JSON.parse(data);
            } catch (err: any & Error) {
                req.body = {} as Req['body'];
                err.status = 422;
                err.details = err.message;
                err.message = 'Invalid content';
                next(err);
            }
        });
        req.on('error', next)
    }
    next();
}