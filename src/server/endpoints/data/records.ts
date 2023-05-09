import { base } from '$server/lib/base';
import { upKeys } from '$server/lib/utils';
import type { App } from '$server/http/types';

export function records(app: App) {

    app.use(async (req, res, next) => {
        const { file } = req.params
        req.base = await base(`data/${file}/records.json`)
        next()
    });

    app.get((req, res, next) => {
        if (Object.keys(req.query).length) {
            const records = req.base.data
            res.send(records);
        } else {
            const records = req.base.data
            res.send(records);
        }
    });

    app.post(async (req, res, next) => {
        try {
            const record = req.body
            const id = record.id || Date.now()
            const records = await req.base.insert({ ...record, id, updated: id }, 0)
            res.send(records);
        } catch (err) {
            console.log('recordsPOST: ', err);
            next();
        }
    });

    app.put(async (req, res, next) => {
        try {
            const record = { ...req.body, updated: Date.now() };
            const records = await req.base.update({ id: record.id }, record)
            res.send(records);
        } catch (err) {
            console.log('recordsPUT: ', err);
            next();
        }
    });

    app.patch(async (req, res, next) => {
        const keys = req.body
        try {
            const records = await req.base.update({}, (doc) => upKeys(doc, keys))
            res.send(records)
        } catch (e) {
            console.log('recordsPATCH: ', e);
            next();
        }
    });

    app.delete(async (req, res, next) => {
        try {
            const IDs = req.body
            const records = await req.base.delete(({ id }) => IDs.includes(id))
            res.send(records)
        } catch (err) {
            console.log('recordsDELETE: ', err);
            next();
        }
    });
}
