import { start } from './http';
import type { Options } from './types';

export function server(options: Partial<Options>) {
    return start(Object.assign({
        host: 'localhost',
        port: 8000,
        index: 'index.html',
        serve: 'public',
        spa: false,
        compress: false,
        cache: 0,
    }, options))
}
