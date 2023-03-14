import { startHTTPServer, createMiddlwaresList } from './http.js';
import { clientWatch } from './watch.js';
import type { Options } from './types.js';

const defaultOptions: Partial<Options> = {
    host: 'localhost',
    port: 7000,
    serve: 'public',
    index: 'index.html',
    compress: false,
    cache: 0,
    spa: false,
    livereload: false
}

export function derver(options: Partial<Options>) {
    const middlewares = createMiddlwaresList()
    const opts = Object.assign(defaultOptions, options, { middlewares });

    startHTTPServer(opts as Options)
    opts.livereload && clientWatch(opts.serve)

    return opts.middlewares;
}
