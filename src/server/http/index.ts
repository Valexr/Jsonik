import { start } from './http.js';
import type { Options } from './types.js';

export function server(options: Partial<Options>) {
    return start(Object.assign({
        host: 'localhost',
        port: 8000,
        index: 'index.html',
        serve: 'public',
        compress: false,
        spa: false,
        cache: 0,
    }, options))
}
