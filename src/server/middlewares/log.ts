import DB from '$server/lib/db'
import type { Next, Req, Res } from "$server/derver/types";

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
    const LOGS = await DB.connect('logs');
    const date = Date.now()
    const { method, url, socket: { remoteAddress }, headers: { referer } } = req
    const { statusCode } = res
    await LOGS?.insert({ date, method, status: statusCode, url, ip: remoteAddress, referer })
    next();
}
