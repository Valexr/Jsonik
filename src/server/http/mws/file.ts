import { stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { join, extname, dirname } from 'path';
import mime from './mime.json';
import type { Next, Options, Req, Res } from "../types";

export function file(options: Options) {
    return async function (req: Req, res: Res, next: Next) {
        if (req.method === 'GET') {
            req.file = join(options.serve, req.path);
            req.extname = extname(req.file);

            if (req.extname === '') {
                req.file = join(req.file, options.index);
                req.extname = extname(req.file);
            }

            req.exists = await isExists(req.file);

            if (options.spa && !req.exists && req.extname === extname(options.index)) {
                let dir = dirname(req.file);
                do {
                    dir = dirname(dir)
                    req.file = join(dir, options.index);
                    if (req.exists = await isExists(req.file)) break;
                } while (dir !== '.')
            }
        }
        next();
    }
}

export async function statik(req: Req, res: Res, next: Next) {
    if (req.method === 'GET') {
        if (!req.exists) return res.error(404, 'Not found');

        const ext = mime[req.extname as keyof typeof mime]
        if (ext) res.setHeader('Content-Type', ext);

        const stream = createReadStream(req.file)
        stream.on('error', (e) => res.error(422, e.message))
        stream.pipe(res)
    }
}

async function isExists(file: string) {
    try {
        await stat(file);
        return true
    } catch {
        return false
    }
}