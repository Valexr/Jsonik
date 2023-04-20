import fs from 'fs/promises';
import path from 'path';
import zlib from 'zlib';
import mime from './mime.json';
import type { Next, Options, Req, Res } from "./types.js";
import type { OutgoingHttpHeaders } from 'http';
import { createReadStream } from 'node:fs';

export function mwURLParse() {
    return function (req: Req, _res: Res, next: Next) {
        const parts = new URL(req.url, 'http://' + (req.headers.host || 'derver.tld'));
        req.path = parts.pathname;
        req.host = parts.host;
        req.hostname = parts.hostname;
        req.port = parts.port;
        req.search = parts.search;
        req.query = Array.from(parts.searchParams)
            .reduce<{ [key: string]: string }>((obj, [name, value]) => (obj[name] = value, obj), {});
        next();
    }
}

export function mwBodyParse() {
    return function (req: Req, _res: Res, next: Next) {
        const isForm = req.headers['content-type'] === 'multipart/form-data'
        const isJson = req.headers['content-type'] === 'application/json'

        if (isJson || isForm) {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', () => {
                if (data) {
                    try {
                        req.body = isJson ? JSON.parse(data) : data;
                    } catch (err: any & Error) {
                        req.body = {} as Req['body'];
                        console.log(err.message);
                    }
                }
                next();
            });
        } else next();
    }
}

export function mwFile(options: Options) {
    return async function (req: Req, _res: Res, next: Next) {
        req.file = path.join(options.serve, req.path);
        req.extname = path.extname(req.file);

        if (req.extname === '') {
            req.file = path.join(req.file, options.index);
            req.extname = path.extname(req.file);
        }

        req.exists = await isExists(req.file);

        if (options.spa && !req.exists && req.extname === path.extname(options.index)) {
            let dir = path.dirname(req.file);
            do {
                dir = path.dirname(dir)
                req.file = path.join(dir, options.index);
                if (req.exists = await isExists(req.file)) break;
            } while (dir !== '.')
        }

        next();
    }
}

export function mwSend() {
    return function (_req: Req, res: Res, next: Next) {
        res.send = function (message) {
            let mime = 'text/plain';
            if (typeof message === 'object') {
                message = JSON.stringify(message);
                mime = 'application/json'
            }
            res.writeHead(200, { 'Content-Type': mime });
            res.end(message);
        }
        next();
    }
}

export function mwError() {
    return function (_req: Req, res: Res, next: Next) {
        res.error = (code = 500, message: string | Body, headers?: OutgoingHttpHeaders) => {
            let mime = 'text/plain';
            if (typeof message === 'object') {
                message = JSON.stringify(message);
                mime = 'application/json'
            }
            res.writeHead(code, { 'Content-Type': mime, ...headers });
            res.end(message);
        };
        next();
    }
}

export function mwStatic() {
    return async function (req: Req, res: Res, next: Next) {
        if (!req.exists) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('Not found');
        }
        const ext = mime[req.extname as keyof typeof mime]
        if (ext) res.setHeader('Content-Type', ext);

        // const stream = createReadStream(req.file)
        // stream.on('error', (e) => res.error(422, e.message))
        // stream.pipe(res)

        res.body = await fs.readFile(req.file);
        next();
    }
}

export function mwCompress() {
    return function (req: Req, res: Res, next: () => void) {
        if (res.body && req.headers['accept-encoding']) {
            if (req.headers['accept-encoding'].includes('br')) {
                res.setHeader('Content-Encoding', 'br');
                res.body = zlib.brotliCompressSync(res.body);
            } else if (req.headers['accept-encoding'].includes('gzip')) {
                res.setHeader('Content-Encoding', 'gzip');
                res.body = zlib.gzipSync(res.body);
            }
        }
        next();
    }
}

export function mwCache(options: Options) {
    return function (req: Req, res: Res, next: Next) {
        if (typeof options.cache !== 'number') options.cache = 31536000;
        res.setHeader('Cache-Control', 'max-age=' + options.cache);
        next();
    }
}

async function isExists(file: string) {
    try {
        await fs.stat(file);
        return true
    } catch {
        return false
    }
}