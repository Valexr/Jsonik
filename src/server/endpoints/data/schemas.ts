import type { App } from '$server/http/types';

export function schemas(app: App) {

    app.get((req, res, next) => {
        const { schemas } = req.base?.data
        res.send(schemas)
    });

    app.post(async (req, res, next) => {
        try {
            const schemas = req.body
            await req.base?.assign({ schemas })
            res.send(schemas);
        } catch (e) {
            console.log('schemasPOST: ', e);
            next();
        }
    });

    // app.put(async (req, res, next) => { });
    // app.patch(async (req, res, next) => { });
    // app.delete(async (req, res, next) => { });
}
