import { readdir } from "node:fs/promises";
import { base } from "$server/lib/db";
import { HttpNotFound } from '$server/lib/errors';
import type { Next, Req, Res } from "$server/http/types";

export async function connect(req: Req, res: Res, next: Next) {
    try {
        // console.log(req.path, req.params)
        const [_, api, folder] = req.path.split('/')
        // console.log((await readdir('files', { withFileTypes: true })).map(de => de.isDirectory() ? de.name : ''))
        const data = await readdir(folder)
        // const jsons = data.filter(f => f.includes('.json'))
        const files = data.map(f => f.replace(/\..+$/, '')).filter(Boolean)
        const { file, table } = req.params || {}

        Object.assign(req.session, { files })

        if (req.method === 'GET' && !files.includes(file)) {
            // const err = new HttpNotFound('Collection not found')
            // next(err)
            res.error(404, 'Collection not found')
        } else {
            req.base = await base(`${folder}/${file}.json`, table);
            next();
        }
    } catch (e) {
        console.error('connect: ', e);
        next();
    }
}