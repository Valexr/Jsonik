import { readdir, rename, rm } from 'fs/promises';
import { connect } from '$server/middlewares/connect.js';
import type { App } from '$server/derver/types.js';

export function data(app: App) {
    const pattern = '/:file?/:table?'

    app.use(pattern, connect)

    app.get(pattern, async (req, res, next) => {
        const { file, table } = req.params

        if (!file && !table) {
            try {
                const data = await readdir('data')
                const files = data.map(f => f.replace(/\..+$/, '')).filter(Boolean)
                res.send(files)
            } catch (e) {
                console.error(e)
            }
        } else if (!table) {
            try {
                res.send(req.base?.data)
            } catch (err) {
                console.error('dbERR: ', err);
                next();
            }
        } else {
            try {
                res.send(req.base?.data[table])
            } catch (err) {
                console.error('dbERR: ', err);
                next();
            }
        }
    });

    app.post(pattern, async (req, res, next) => {
        try {
            const schemas = req.body
            await req.base?.assign({ schemas })
            res.send(req.body);
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });

    app.put(pattern, async (req, res, next) => {
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

    app.patch(pattern, async (req, res, next) => {
        try {
            req.base?.patch(req.query.patch);
            await req.base?.write();
            next();
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });

    app.delete(pattern, async (req, res, next) => {
        const { file, table } = req.params
        if (!table) {
            try {
                await rm(`data/${file}.json`)
                res.send(file)
            } catch (e) {
                console.log(e)
            }
        }
    });
}
