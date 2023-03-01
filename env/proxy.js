import { createServer, request } from 'http';

export default function (host = '0.0.0.0', port = 8000) {
    return createServer(proxy);

    function proxy(req, res) {
        const forwardRequest = (path) => {
            const options = {
                hostname: host,
                port,
                path,
                method: req.method,
                headers: req.headers,
            };
            const proxyReq = request(options, (proxyRes) => {
                if (proxyRes.statusCode === 404) {
                    return forwardRequest("/");
                }
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                proxyRes.pipe(res, { end: true });
            });

            req.pipe(proxyReq, { end: true });
        };
        forwardRequest(req.url);
    }
}