import http from 'node:http';
import { pattern } from './pattern.js';
import type { Mw, App, Req, Res, Next } from './types.js';

type Obj = {
    method: http.IncomingMessage['method']
    pattern: string,
    exact: boolean,
    middlewares: Mw[]
}

export function create(): App {
    const middlewares: Mw[] = [];

    function app(pattern = '') {
        const methods = new Proxy<object>({}, {
            get(_, name: string) {
                if (name === 'list') return () => middlewares;
                if (name === 'sub') return function () {
                    const args = Array.from(arguments);
                    const parentPattern = pattern + args.shift();
                    args.forEach(fn => fn(app(parentPattern)));
                };

                return function (): object {
                    execute(parse(Array.from(arguments), name, pattern));
                    return methods;
                };
            }
        });
        return methods;
    }
    return app() as App;

    function execute(parsed: Obj) {
        for (const mw of parsed.middlewares) {
            middlewares.push(function (req: Req, res: Res, next: Next) {
                if (parsed.method && parsed.method !== req.method) return next();
                if (!!parsed.pattern) {
                    const match = pattern(parsed.pattern, req.path);
                    if (!match || (parsed.exact && !match.exact)) return next();
                    req.params = match.params as Record<string, string>;
                }
                mw(req, res, next);
            });
        }
    }

    function parse(args: Array<Mw>, name: string, pattern = '') {
        const subpattern = typeof args[0] === 'string' ? args.shift() : '';
        return {
            method: name === 'use' ? '' : name.toUpperCase(),
            pattern: pattern + subpattern,
            exact: !(pattern && !subpattern),
            middlewares: args
        }
    }
}

export function run(mws: Mw[], req: Req, res: Res) {
    mws.push((req, res) => res.end(res.body || ''));
    const next = (err?: any & Error): void =>
        err ? error(err, req, res, next)
            : mws.shift()?.(req, res, next)
    next();
}

function error(err: any & Error, req: Req, res: Res, next: Next) {
    const code = (res.statusCode = err.code || err.status || err.statusCode || 500);
    if (typeof err === 'string' || Buffer.isBuffer(err)) res.end(err);
    else res.end(err.message || http.STATUS_CODES[code]);
}