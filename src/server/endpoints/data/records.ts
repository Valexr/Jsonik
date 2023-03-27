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
                const { keys, records } = req.base?.data
                res.send({ keys, records });
            }
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });

    app.post(async (req, res, next) => {
        try {
            const record = req.body as object
            // await req.base?.assign({ records })
            await req.base?.append({ id: Date.now(), ...record });
            // delete req.query.id;
            // const items = base?.match(req.query);
            const { keys, records } = req.base?.data
            res.send({ keys, records });
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
