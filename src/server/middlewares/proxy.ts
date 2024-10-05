import { request } from 'node:http';
import type { Next, Req, Res } from '$server/http/types';

export function proxy(req: Req, res: Res, next: Next) {

    const connector = request({
        hostname: '0.0.0.0',
        port: 8000,
        path: req.url,
        method: req.method,
        headers: req.headers
    }, (proxy) => {
        res.writeHead(proxy.statusCode || 200, proxy.headers);
        proxy.pipe(res);
    });

    if (req.url.includes('/esbuild')) {
        req.pipe(connector);
    }
    next()
}