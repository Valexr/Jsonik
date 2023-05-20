import http from 'http';
import { create, run } from './app'
import { html } from './mws/html'
import { stream, sse } from './mws/sse';
import { url, json, } from './mws/parse';
import { compress, cache } from './mws/opt'
import { cors, cookie, token } from './mws/auth';
import { send, error, session } from './mws/transport';
import type { Options, Mw, Req, Res } from './types';

export function start(options: Options) {
    const app = create()

    const server = http.createServer((req, res) => {
        const mws: Mw[] = [
            url, json, send, error, stream, sse, cors, cookie, token, session,
            ...app.list(),
            cache(options),
            compress(options),
            html,
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
