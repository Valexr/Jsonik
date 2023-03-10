import { readdir, readFile } from 'node:fs/promises';
import DB from '$server/lib/db';
import type { App, Next, Req, Res } from '$server/derver/types';
import type { Base } from '$types/server';
import { checkdir } from '$server/lib/utils';

let base: Base

async function connect(req: Req, res: Res, next: Next) {
    if (!req.params.file && !req.params.table) {
        await checkdir('data')
        const files = await readdir('data')
        base = {} as Base
        for (const file of files) {
            const text = await readFile('data' + '/' + file, { encoding: 'utf-8' })
            console.dir(file)
            base[file.replace('.json', '')] = JSON.parse(text)
        }
        next()
    } else {
        try {
            base = await DB.connect(req.params.file, req.params.table);
            next();
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    }
}

export function data(app: App) {
    const pattern = '/:file/:table?'

    app.use(pattern, connect);

    app.get(pattern, async (req, res, next) => {
        console.log('data:', req.params)
        try {
            if (Object.keys(req.query).length) {
                // const filters = base?.filters(req.query);
                const items = req.query.q ? base?.search(req.query.q) : base?.match(req.query);
                // req.query.id ? res.send(base?.id(+req.query.id)) : res.send(items);
                res.send(items);
            } else if (!req.params.file && !req.params.table) {
                console.log(base)
                res.send(base)
            } else if (!req.params.table) {
                res.send(base?.data);
            } else {
                res.send(base?.table);
            }
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });

    app.post(pattern, async (req, res, next) => {
        const meta = { id: Date.now(), create: Date.now(), update: Date.now(), role: req.query.role };
        try {
            await base?.insert({ ...req.body, ...meta });
            delete req.query.id;
            const items = base?.match(req.query);
            res.send(items);
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });

    app.put(pattern, async (req, res, next) => {
        const meta = { ...req.body, update: Date.now() };
        try {
            await base?.update(+req.query.id, meta);
            delete req.query.id;
            const items = base?.match(req.query);
            res.send(items);
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });

    app.patch(pattern, async (req, res, next) => {
        try {
            base?.patch(req.query.patch);
            await base?.write();
            next();
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });

    app.delete(pattern, async (req, res, next) => {
        try {
            req.query.prop ? await base?.deleteprop(req.query.prop) : await base?.delete(req.query);
            delete req.query.id;
            const items = base?.match(req.query);
            res.send(items);
        } catch (err) {
            console.log('dbERR: ', err);
            next();
        }
    });
}
