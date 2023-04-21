import { startHTTPServer, createMiddlwaresList } from './http.js';
import type { Options } from './types.js';

const defaultOptions: Partial<Options> = {
    host: 'localhost',
    port: 8000,
    index: 'index.html',
    compress: false,
    cache: 0,
    spa: false,
}

export function server(options: Partial<Options>) {
    const middlewares = createMiddlwaresList()
    const opts = Object.assign(defaultOptions, options, { middlewares });

    startHTTPServer(opts as Options)

    return opts.middlewares;
}
