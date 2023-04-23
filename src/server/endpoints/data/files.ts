import { readdir, rename, rm, readFile } from "fs/promises";
import { base } from "$server/lib/db.js";
import { checkdir } from "$server/lib/utils.js";
import { App } from "$server/http/types.js";

export function files(app: App) {

    app.get(async (req, res, next) => {
        // console.log(req.url, req.params)
        await checkdir('data')
        try {
            const data = await readdir('data')
            const files = data.map(f => f.replace(/\..+$/, '')).filter(Boolean)
            res.send(files)
        } catch (e) {
            console.error(e)
            next()
        }
    })

    app.patch(async (req, res, next) => {
        const { file } = req.params
        const { name } = req.query
        try {
            await rename(`data/${file}.json`, `data/${name}.json`)
            res.send(name)
        } catch (e) {
            console.error(e)
            next()
        }
    });

    app.delete(async (req, res, next) => {
        const { file } = req.params
        try {
            // const data = await readFile(`data/${file}.json`, { encoding: 'utf8' })
            const db = await base(`data/${file}.json`)
            await db?.clear()
            await rm(`data/${file}.json`)
            res.send(file)
        } catch (e) {
            console.error(e)
            next()
        }
    });
}