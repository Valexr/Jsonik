import http from 'http';
import { mwURLParse, mwJsonParse, mwSend, mwError, mwFile, mwStatic, mwCompress, mwCache } from './mws'
import { mwLivereload } from './livereload';
import type { Options, Mw, App, Req, Res, Next } from './types';

export function startHTTPServer(options: Options) {
    const server = http.createServer(function (req, res) {
        const middlewares: Mw[] = [
            mwURLParse(),
            mwJsonParse(),
            mwSend(),
            mwError(),
            ...options.middlewares.list(),
            ...(options.serve ? [mwFile(options), mwStatic()] : []),
            ...(options.compress ? [mwCompress()] : []),
            ...(options.cache ? [mwCache(options)] : []),
            ...(options.livereload ? [mwLivereload()] : []),
        ];

        runMiddlewares(middlewares, req as Req, res as Res);
    })

    server.on('listening', () => {
        console.log(`Serve on http://${options.host}:${options.port}`)
    })

    server.on('error', (e) => {
        console.error('Server starting error:', e);
    })

    server.listen(options.port, options.host);

    process.on('SIGTERM', () => server.close());
    process.on('exit', () => server.close());
}

function runMiddlewares(mws: Mw[], req: Req, res: Res) {
    mws.push((_req, res) => res.end(res.body || ''));
    const next = (): void => {
        let mw: Mw | undefined;
        while (!mw && mws.length > 0) {
            mw = mws.shift();
        }
        mw && mw(req, res, next);
    }
    next();
}

type Obj = {
    method: http.IncomingMessage['method']
    pattern: string,
    exact: boolean,
    middlewares: Mw[]
}

export function createMiddlwaresList(): App {
    const middlewares: Mw[] = [];

    function addMiddleware(obj: Obj) {
        for (const mw of obj.middlewares) {
            middlewares.push(function (req: Req, res: Res, next: Next) {

                if (obj.method && obj.method !== req.method) return next();

                if (obj.pattern && obj.pattern !== '') {
                    const match = getRouteMatch(obj.pattern, req.path);
                    if (!match || (obj.exact && !match.exact)) return next();
                    req.params = match.params as Record<string, string>;
                }
                mw?.(req, res, next);
            });
        }
    }

    function parseArguments(args: Array<Mw>, name: string, pattern?: string) {
        const subpattern = args.length && typeof args[0] === 'string' ? args.shift() : '';
        return {
            method: name === 'use' ? '' : name.toUpperCase(),
            pattern: (pattern || '') + (subpattern || ''),
            exact: !(pattern && !subpattern),
            middlewares: args.filter((fn: any) => typeof fn === 'function')
        }
    }

    function getMethods(pattern?: string) {
        const methods = new Proxy<object>({}, {
            get(_, name: string) {
                if (name === 'list') return () => middlewares;
                if (name === 'sub') return function () {
                    const args = Array.from(arguments);
                    const parentPattern = (pattern || '') + args.shift();
                    args.forEach(fn => fn(getMethods(parentPattern)));
                };
                return function (): object {
                    addMiddleware(parseArguments(Array.from(arguments), name, pattern));
                    return methods;
                };
            }
        });
        return methods;
    }
    return getMethods() as App;
}

function getRouteMatch(pattern: string, path: string) {
    const keys: string[] = [];
    const params: { [key: string]: string | undefined } = {};
    const rx = pattern
        .split('/')
        .map(s => {
            return s.endsWith('?') ? (keys.push(s.slice(1, -1)), '(.*?)')
                : s.startsWith(':') ? (keys.push(s.slice(1)), '(.+)') : s
        })
        .join('/');

    let exact = true;
    let match = path.match(new RegExp(`^${rx}$`));

    if (!match) {
        exact = false;
        match = path.match(new RegExp(`^${rx}`));
    }
    if (!match) return null;

    keys.forEach((key, i) => params[key] = match?.[i + 1]);

    return {
        exact,
        params,
        part: match[0].slice(0, -1)
    }
}
