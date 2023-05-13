import http from 'http';
import { create, run } from './app'
import { url, json, send, error, cors, cookie, token, session, html, compress, cache } from './mws'
import type { Options, Mw, Req, Res } from './types';

export function start(options: Options) {
    const app = create()

    const server = http.createServer((req, res) => {
        const mws: Mw[] = [
            url, send, error, json, cors, cookie, token, session,
            ...app.list(), html,
            cache(options),
            compress(options),
        ];
        run(mws, req as Req, res as Res);
    })

    server.listen(options.port, options.host);

    server.on('listening', () => {
        const time = new Date().toLocaleTimeString(undefined, { hour12: false });
        console.dir(`${time} Jsonik on http://${options.host}:${options.port}`)
    })

    server.on('error', (e) => {
        console.error('Server starting error:', e);
    })

    process.on('SIGTERM', () => server.close());
    process.on('exit', () => server.close());

    return app
}
