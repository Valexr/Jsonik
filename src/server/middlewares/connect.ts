import { base } from "$server/lib/db.js";
import type { Next, Req, Res } from "$server/derver/types.js";

export async function connect(req: Req, res: Res, next: Next) {
    try {
        const folder = req.path.split('/')[3]
        const { file, table } = req.params
        req.base = await base(`${folder}/${file}.json`, table);
        next();
    } catch (e) {
        console.error('connect: ', e);
        next();
    }
}