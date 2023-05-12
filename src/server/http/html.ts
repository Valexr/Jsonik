import client from './client.json'
import type { Next, Req, Res } from "./types";

export function html(req: Req, res: Res, next: Next) {
    if (req.method === 'GET' && req.file.includes('index.html')) {
        console.log('file', req.file)
        res.send(client, 'text/html')
    } else next()
}