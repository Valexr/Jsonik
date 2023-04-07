import { connect } from '$server/middlewares/connect.js';
import type { App } from '$server/derver/types.js';

export function logs(app: App) {
    const pattern = '/:file?/:table?'

    app.use(pattern, connect);

    app.get(pattern, async (req, res, next) => {
        try {
            console.log(req.query)
            if (Object.values(req.query).some(v => v)) {
                const { q, page, limit } = req.query
                const items = req.query.q
                    ? req.base?.search(q)
                    : req.base?.match(req.query);
                const index = Number(page) - 1
                const start = index ? index * Number(limit) : index
                res.send(items.splice(start, limit));
            } else if (!req.params.file && !req.params.table) {
                res.send(req.body)
            } else if (!req.params.table) {
                res.send(req.base?.data);
            } else {
                res.send(req.base?.table);
            }
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });
}
