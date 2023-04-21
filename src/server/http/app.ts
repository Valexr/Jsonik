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

    function addMiddleware(obj: Obj) {
        for (const mw of obj.middlewares) {
            middlewares.push(function (req: Req, res: Res, next: Next) {

                if (obj.method && obj.method !== req.method) return next();

                if (!!obj.pattern) {
                    const match = pattern(obj.pattern, req.path);
                    if (!match || (obj.exact && !match.exact)) return next();
                    req.params = match.params as Record<string, string>;
                }
                mw?.(req, res, next);
            });
        }
    }

    function parseArguments(args: Array<Mw>, name: string, pattern = '') {
        const subpattern = typeof args[0] === 'string' ? args.shift() : '';
        return {
            method: name === 'use' ? '' : name.toUpperCase(),
            pattern: pattern + subpattern,
            exact: !(pattern && !subpattern),
            middlewares: args.filter((fn: any) => typeof fn === 'function')
        }
    }
}

export function run(mws: Mw[], req: Req, res: Res) {
    mws.push((_req, res) => res.end(res.body || ''));
    const next = (err?: any & Error): void =>
        err ? onError(err, req, res, next)
            : mws.shift()?.(req, res, next)
    next();
}

function onError(err: any & Error, req: Req, res: Res, next: Next) {
    const code = (res.statusCode = err.code || err.status || err.statusCode || 500);
    if (typeof err === 'string' || Buffer.isBuffer(err)) res.end(err);
    else res.end(err.message || http.STATUS_CODES[code]);
}