import { base } from '$server/lib/base';
import type { App } from '$server/http/types';
import type { Schema } from '$client/stores/schemas';

export function schemas(app: App) {

    app.use(async (req, res, next) => {
        const { file } = req.params
        req.base = await base<Schema>(`data/${file}/schemas.json`)
        next()
    });

    app.get((req, res, next) => {
        const schemas = req.base.data
        res.send(schemas)
    });

    app.post(async (req, res, next) => {
        try {
            const schemas = await req.base.insert(req.body)
            res.send(schemas);
        } catch (e) {
            console.log('schemasPOST: ', e);
            next();
        }
    });

    app.put(async (req, res, next) => {
        const schemas = await req.base.set(req.body)
        // const schemas = await req.base.upsert((doc) => req.body.find(({ id }: Schema) => doc.id === id), req.body)
        // await req.base.update({}, (doc) => schemas.find(({ id }: Schema) => doc.id === id))
        res.send(schemas);
    });
    // app.patch(async (req, res, next) => { });
    // app.delete(async (req, res, next) => { });
}
