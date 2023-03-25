import { readdir, rename, rm } from 'fs/promises';
import type { App } from '$server/derver/types.js';
import { Data, Schema } from '$client/stores/data.js';


export function records(app: App) {
    app.get(async (req, res, next) => {
        const { file } = req.params
        try {
            if (Object.keys(req.query).length) {
                // const filters = base?.filters(req.query);
                const items = req.query.q ? req.base?.search(req.query.q) : req.base?.match(req.query);
                // req.query.id ? res.send(base?.id(+req.query.id)) : res.send(items);
                res.send(items);
            } else {
                const keys = req.base?.data.schemas?.map((s: Schema) => s.type)
                await req.base?.assign({ keys })
                res.send(req.base?.data);
            }
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });

    app.post(async (req, res, next) => {
        // const meta = { id: Date.now(), create: Date.now(), update: Date.now(), role: req.query.role };
        try {
            await req.base?.assign(req.body)
            // await base?.append({ ...req.body, ...meta });
            // delete req.query.id;
            // const items = base?.match(req.query);
            res.send('ok');
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });

    app.put(async (req, res, next) => {
        const meta = { ...req.body, update: Date.now() };
        try {
            await req.base?.update(+req.query.id, meta);
            delete req.query.id;
            const items = req.base?.match(req.query);
            res.send(items);
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });

    app.patch(async (req, res, next) => {
        const { file } = req.params
        const { name } = req.query
        if (req.query.name) {
            await rename(`data/${file}.json`, `data/${name}.json`)
            res.send(name)
        } else {
            try {
                req.base?.patch(req.query.patch);
                await req.base?.write();
                next();
            } catch (err) {
                console.log('dbERR: ', err);
                next();
            }
        }
    });

    app.delete(async (req, res, next) => {
        const { file, table } = req.params
        if (!table) {
            try {
                await rm(`data/${file}.json`)
                res.send(file)
            } catch (e) {
                console.log(e)
            }
        }
        // try {
        //     req.query.prop ? await base?.deleteprop(req.query.prop) : await base?.delete(req.query);
        //     delete req.query.id;
        //     const items = base?.match(req.query);
        //     res.send(items);
        // } catch (err) {
        //     console.log('dbERR: ', err);
        //     next();
        // }
    });
}
