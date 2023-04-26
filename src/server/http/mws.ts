import fs from 'fs/promises';
import path from 'path';
import zlib from 'zlib';
import mime from './mime.json';
import qs from 'node:querystring';
import { createReadStream } from 'node:fs';
import type { Next, Options, Req, Res } from "./types.js";
import type { OutgoingHttpHeaders } from 'http';

export function url(req: Req, res: Res, next: Next) {
    const parts = new URL(req.url, `http://${req.headers.host}`);
    req.path = parts.pathname;
    req.host = parts.host;
    req.hostname = parts.hostname;
    req.port = parts.port;
    req.search = parts.search;
    req.query = qs.parse(req.search.substring(1))
    next();
}

export function json(req: Req, res: Res, next: Next) {
    if (req.headers['content-type'] === 'application/json') {
        let data = '';

        req.on('data', chunk => {
            data += chunk;
        })

        req.on('end', () => {
            try {
                req.body = JSON.parse(data);
            } catch (err: any & Error) {
                req.body = {} as Req['body'];
                console.log(err.message);
            }
            next();
        });
        req.on('error', next)
    } else next();
}

export function send(req: Req, res: Res, next: Next) {
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

export function error(req: Req, res: Res, next: Next) {
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

export function session(req: Req, res: Res, next: Next) {
    req.session ||= {}
    next()
}

export function file(options: Options) {
    return async function (req: Req, res: Res, next: Next) {
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

export async function statik(req: Req, res: Res, next: Next) {
    if (!req.exists) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Not found');
    }
    const ext = mime[req.extname as keyof typeof mime]
    if (ext) res.setHeader('Content-Type', ext);

    const stream = createReadStream(req.file)
    stream.on('error', (e) => res.error(422, e.message))
    stream.pipe(res)

    // res.body = await fs.readFile(req.file);
    // next();
}

export function compress(req: Req, res: Res, next: () => void) {
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

export function cache(options: Options) {
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