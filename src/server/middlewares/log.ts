import { base } from '$server/lib/db'
import type { Next, Req, Res } from "$server/http/types";

export async function log(req: Req, res: Res, next: Next) {
    const LOGS = await base('logs/data.json');
    const { method, url, socket: { remoteAddress }, headers: { referer } } = req

    res.on('finish', register)

    async function register() {
        res.off('finish', register)
        const { statusCode, statusMessage } = res
        const log = {
            id: Date.now(),
            method, url,
            status: statusCode, message: statusMessage,
            ip: remoteAddress, referer
        }
        await LOGS?.prepend(log)
    }

    next();
}
