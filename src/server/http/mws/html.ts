import { stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { extname } from 'path';
import client from './client.json'
import type { Next, Req, Res } from "../types";

export function html(req: Req, res: Res, next: Next) {
    if (req.method === 'GET' && !extname(req.path) && req.headers.accept !== 'text/event-stream') {
        res.send(client, 'text/html')
    } else next()
}