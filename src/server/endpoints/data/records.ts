import { readdir } from 'fs/promises';
import type { App } from '$server/derver/types.js';

export function records(app: App) {
    app.get(async (req, res, next) => {
        const { file } = req.params
        const data = await readdir('data')
        const files = data.map(f => f.replace(/\..+$/, '')).filter(Boolean)

        try {
            if (Object.keys(req.query).length) {
                // const filters = base?.filters(req.query);
                const records = req.query.q ? req.base?.search(req.query.q) : req.base?.match(req.query);
                // req.query.id ? res.send(base?.id(+req.query.id)) : res.send(items);
                res.send(records);
            } else if (files.includes(file)) {
                const { records } = req.base?.data
                res.send(records);
            } else res.error(404, 'Collection not found')
        } catch (err) {
            console.log('recordsGET: ', err);
            next();
        }
    });

    app.post(async (req, res, next) => {
        try {
            const record = req.body
            const id = Date.now()
            await req.base?.prepend({ ...record, id, updated: id });

            const { records } = req.base?.data
            res.send(records);
        } catch (err) {
            console.log('recordsPOST: ', err);
            next();
        }
    });

    app.put(async (req, res, next) => {
        const record = { ...req.body, id: Number(req.body.id), updated: Date.now() };
        try {
            const records = await req.base?.update(record);
            res.send(records);
        } catch (err) {
            console.log('recordsPUT: ', err);
            next();
        }
    });

    app.patch(async (req, res, next) => {
        const keys = req.body
        try {
            const records = await req.base?.upkeys(keys)
            res.send(records)
        } catch (e) {
            console.log('recordsPATCH: ', e);
            next();
        }
    });

    app.delete(async (req, res, next) => {
        try {
            const IDs = req.body
            const records = await req.base?.deleteIDs(IDs)
            res.send(records)
        } catch (err) {
            console.log('recordsDELETE: ', err);
            next();
        }
    });
}
