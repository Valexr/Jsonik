import { Schema } from '$client/stores/data.js';
import type { App } from '$server/derver/types.js';

export function schemas(app: App) {
    app.get(async (req, res, next) => {
        const { file } = req.params
        try {
            res.send(req.base?.table)
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });

    app.post(async (req, res, next) => {
        try {
            const schemas = req.body as Schema[]
            // const keys = Array.from(schemas, ({ type, name }) => ({ type, name }))
            await req.base?.assign({ schemas })
            res.send(req.body);
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });

    app.put(async (req, res, next) => {
        // const meta = { ...req.body, update: Date.now() }
        try {
            await req.base?.update(+req.query.id, {});
            delete req.query.id;
            const items = req.base?.match(req.query);
            res.send(items);
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });

    app.patch(async (req, res, next) => {
        try {
            req.base?.patch(req.query.patch);
            await req.base?.write();
            next();
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });

    app.delete(async (req, res, next) => { });
}
