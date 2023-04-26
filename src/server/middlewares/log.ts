import { base } from '$server/lib/db.js'
import type { Next, Req, Res } from "$server/http/types.js";

export async function log(req: Req, res: Res, next: Next) {
    const LOGS = await base('logs/data.json');
    const { method, url, socket: { remoteAddress }, headers: { referer } } = req
    const log = { id: Date.now(), method, url, ip: remoteAddress, referer }

    res.on('finish', register)

    async function register() {
        res.off('finish', register)
        const { statusCode, statusMessage } = res
        Object.assign(log, { status: statusCode, message: statusMessage, })
        await LOGS?.prepend(log)
    }

    next();
}
