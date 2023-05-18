import path from 'path';
import client from '$server/client.json'
import type { Next, Req, Res } from "$server/http/types";


export function html(req: Req, res: Res, next: Next) {
    if (req.method === 'GET' && !path.extname(req.path) && req.headers.accept !== 'text/event-stream') {
        res.send(client, 'text/html')
    } else next()
}