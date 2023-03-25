import { connect } from '$server/middlewares/connect.js';
import type { App } from '$server/derver/types.js';

export function logs(app: App) {
    const pattern = '/:file?/:table?'

    app.use(pattern, connect);

    app.get(pattern, async (req, res, next) => {
        try {
            if (Object.keys(req.query).length) {
                const items = req.query.q
                    ? req.base?.search(req.query.q)
                    : req.base?.match(req.query);
                res.send(items);
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
