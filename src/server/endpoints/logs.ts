import { base } from '$server/lib/base';
import type { App } from '$server/http/types';
import type { Log } from '$server/middlewares/log';


export function logs(app: App) {

    app.get(async (req, res, next) => {
        if (Object.values(req.query).some(v => v)) {
            const LOGS = await base<Log>('logs/data.json')
            const { q, page, limit } = req.query
            const items = LOGS.find((doc, i) => search(doc, String(q)))
            const index = Number(page) - 1
            const start = index * Number(limit)
            const end = start + Number(limit)
            const perpage = items.slice(start, end)
            res.send({ docs: perpage, total: items.length })
        }
    });
}

function search(doc: Record<string, any>, q: string) {
    if (!q) return true
    if (q.includes(':')) {
        const [k, v] = q.split(':')
        return new RegExp(doc[k], 'i').test(v)
    } else
        return Object.entries(doc).some(([k, v]) => {
            if (q.includes(',')) {
                const query = q.split(',')
                return query.every(q => new RegExp(q, 'i').test(v))
            } else return new RegExp(q, 'i').test(v)
        })
}