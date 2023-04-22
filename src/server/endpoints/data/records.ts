import type { App } from '$server/http/types.js';

export function records(app: App) {

    app.get((req, res, next) => {
        if (Object.keys(req.query).length) {
            const records = req.query.q ? req.base?.search(req.query.q) : req.base?.match(req.query)
            // req.query.id ? req.base?.id(+req.query.id) : req.base?.match(req.query);
            res.send(records);
        } else {
            const { records } = req.base?.data
            res.send(records);
        }
    });

    app.post(async (req, res, next) => {
        try {
            const record = req.body
            const id = record.id || Date.now()
            await req.base?.prepend({ ...record, id, updated: id });

            const { records } = req.base?.data
            res.send(records);
        } catch (err) {
            console.log('recordsPOST: ', err);
            next();
        }
    });

    app.put(async (req, res, next) => {
        const records = req.body.map((r: Record<string, any>) => ({ ...r, updated: Date.now() }));
        try {
            const updated = await req.base?.upRecords(records);
            res.send(updated);
        } catch (err) {
            console.log('recordsPUT: ', err);
            next();
        }
    });

    app.patch(async (req, res, next) => {
        const keys = req.body
        try {
            const records = await req.base?.upKeys(keys)
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
