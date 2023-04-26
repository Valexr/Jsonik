import http from 'http';
import { create, run } from './app.js'
import { url, json, send, error, file, session, statik, compress, cache } from './mws.js'
import type { Options, Mw, Req, Res } from './types.js';

export function start(options: Options) {
    const app = create()

    const server = http.createServer((req, res) => {
        const mws: Mw[] = [
            url, json, send, error, session,
            ...app.list(),
            ...(options.serve ? [file(options), statik] : []),
            ...(options.cache ? [cache(options)] : []),
            ...(options.compress ? [compress] : []),
        ];
        run(mws, req as Req, res as Res);
    })

    server.listen(options.port, options.host);

    server.on('listening', () => {
        const time = new Date().toLocaleTimeString(undefined, { hour12: false });
        console.log(`${time} Server on http://${options.host}:${options.port}`)
    })

    server.on('error', (e) => {
        console.error('Server starting error:', e);
    })

    process.on('SIGTERM', () => server.close());
    process.on('exit', () => server.close());

    return app
}
