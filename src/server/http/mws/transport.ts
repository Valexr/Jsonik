import type { Next, Req, Res } from "../types";

export function send(req: Req, res: Res, next: Next) {
    res.send = function (message, mime = 'text/plain') {
        if (typeof message === 'object') {
            message = JSON.stringify(message);
            mime = 'application/json'
        }
        res.writeHead(200, { 'Content-Type': mime });
        res.end(message);
    }
    next();
}

export function error(req: Req, res: Res, next: Next) {
    res.error = (code = 500, message: string | Body) => {
        let mime = 'text/plain';
        if (typeof message === 'object') {
            message = JSON.stringify(message);
            mime = 'application/json'
        }
        res.writeHead(code, { 'Content-Type': mime });
        res.end(message);
    };
    next();
}

export function session(req: Req, res: Res, next: Next) {
    req.session ||= {}
    next()
}