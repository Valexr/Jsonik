import { readdir, rename, rm } from 'fs/promises';
import type { App } from '$server/derver/types.js';
import { Collection, Schema } from '$client/stores/data.js';


export function records(app: App) {
    app.get(async (req, res, next) => {
        const { file } = req.params
        try {
            if (Object.keys(req.query).length) {
                // const filters = base?.filters(req.query);
                const items = req.query.q ? req.base?.search(req.query.q) : req.base?.match(req.query);
                // req.query.id ? res.send(base?.id(+req.query.id)) : res.send(items);
                res.send(items);
            } else if (file) {
                const { keys, records, schemas } = req.base?.data
                res.send({ keys, records, schemas });
            } else next()
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });

    app.post(async (req, res, next) => {
        try {
            const record = req.body as object
            // await req.base?.assign({ records })
            await req.base?.prepend({ id: Date.now(), ...record });
            // delete req.query.id;
            // const items = base?.match(req.query);
            const { keys, records, schemas } = req.base?.data
            res.send({ keys, records, schemas });
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });

    app.put(async (req, res, next) => {
        // const meta = { ...req.body, update: Date.now() };
        const keys = req.body
        try {
            const items = await req.base?.upkeys(keys)
            // await req.base?.update(+req.query.id, meta);
            // delete req.query.id;
            // const items = req.base?.match(req.query);
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
        const { file } = req.params
        try {
            const IDs = req.body
            const table = await req.base?.deleteIDs(IDs)
            res.send(table)
        } catch (err) {
            console.log('dbERR: ', err);
            next();
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
