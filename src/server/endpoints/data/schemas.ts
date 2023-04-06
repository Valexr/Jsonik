import type { App } from '$server/derver/types.js';

export function schemas(app: App) {

    app.get(async (req, res, next) => {
        try {
            res.send(req.base?.table)
        } catch (e) {
            console.log('schemasGET: ', e);
            next();
        }
    });

    app.post(async (req, res, next) => {
        try {
            const schemas = req.body
            await req.base?.assign({ schemas })
            res.send(req.body);
        } catch (e) {
            console.log('schemasPOST: ', e);
            next();
        }
    });

    // app.put(async (req, res, next) => { });
    // app.patch(async (req, res, next) => { });
    // app.delete(async (req, res, next) => { });
}
