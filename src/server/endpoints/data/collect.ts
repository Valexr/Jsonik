import { readdir, rename, rm, readFile } from "fs/promises";
import { checkdir } from "$server/lib/utils.js";
import { App } from "$server/http/types.js";

export function collect(app: App) {

    app.get(async (req, res, next) => {
        const { file } = req.params
        try {
            const data = await readFile(`data/${file}.json`)
            // const files = data.map(f => f.replace(/\..+$/, '')).filter(Boolean)
            // Object.assign(req, files)
            console.log(JSON.parse(data.toString()))
            res.send(JSON.parse(data.toString()))
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
            await rm(`data/${file}.json`)
            res.send(file)
        } catch (e) {
            console.error(e)
            next()
        }
    });
}