import { base } from '$server/lib/db.js'
import type { Next, Req, Res } from "$server/derver/types.js";

export async function log(req: Req, res: Res, next: Next) {
    // console.dir({
    //     req: {
    //         'req.socket.address': req.socket.address(),
    //         'req.socket.remoteAddress': req.socket.remoteAddress,
    //         agent: req.headers['user-agent'],
    //         method: req.method,
    //         headers: req.headers,
    //         'req.url': req.url,
    //         'req.path': req.path,
    //         'req.query': req.query,
    //         'req.params': req.params,
    //         'req.body': req.body,
    //     },
    //     res: {
    //         date: res.sendDate
    //     }
    // });
    const LOGS = await base('logs/data.json');
    const id = Date.now()
    const { method, url, socket: { remoteAddress }, headers: { referer } } = req
    const { statusCode } = res
    await LOGS?.prepend({ id, method, status: statusCode, url, ip: remoteAddress, referer })
    next();
}
