import { base } from "$server/lib/db.js";
import type { Next, Req, Res } from "$server/derver/types.js";

export async function connect(req: Req, res: Res, next: Next) {
    try {
        const folder = req.path.split('/')[3]
        req.base = await base(`${folder}/${req.params.file}.json`, req.params.table);
        next();
    } catch (e) {
        console.error('dbERR: ', e);
        next();
    }
}