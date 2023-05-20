import { brotliCompressSync, gzipSync } from 'zlib';
import type { Next, Options, Req, Res } from "../types";

export function compress(options: Options) {
    return function (req: Req, res: Res, next: Next) {
        if (options.compress && res.body && req.headers['accept-encoding']) {
            if (req.headers['accept-encoding'].includes('br')) {
                res.setHeader('Content-Encoding', 'br');
                res.body = brotliCompressSync(res.body);
            } else if (req.headers['accept-encoding'].includes('gzip')) {
                res.setHeader('Content-Encoding', 'gzip');
                res.body = gzipSync(res.body);
            }
        }
        next();
    }
}

export function cache(options: Options) {
    return function (req: Req, res: Res, next: Next) {
        res.setHeader('Cache-Control', 'max-age=' + options.cache);
        next();
    }
}