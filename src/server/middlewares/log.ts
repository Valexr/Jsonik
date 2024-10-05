import { base } from '$server/lib/base'
import type { Next, Req, Res } from '$server/http/types'
import type { Base } from '$types/server';

export interface Log {
    id: number
    method?: string,
    url: string,
    status: number,
    message: string,
    ip?: string,
    referer?: string
}

let LOGS: Base<Log>

export async function log(req: Req, res: Res, next: Next) {
    const { method, url, socket: { remoteAddress }, headers: { referer } } = req

    LOGS ||= await base<Log>('logs/data.json');

    res.on('finish', async () => await register())

    async function register(): Promise<void> {
        res.off('finish', register)
        const { statusCode, statusMessage } = res
        const log = {
            id: Date.now(),
            method, url,
            status: statusCode, message: statusMessage,
            ip: remoteAddress, referer
        }
        await LOGS.insert([log], 0)
    }
    next();
}
