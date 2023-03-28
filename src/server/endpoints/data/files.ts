import { readdir, rename, rm } from "fs/promises";
import { checkdir } from "$server/lib/utils.js";
import { App } from "$server/derver/types.js";

export function files(app: App) {
    app.get(async (req, res, next) => {
        await checkdir('data')
        try {
            const data = await readdir('data')
            const files = data.map(f => f.replace(/\..+$/, '')).filter(Boolean)
            res.send(files)
        } catch (e) {
            console.error(e)
        }
    })

    app.patch(async (req, res, next) => {
        const { file } = req.params
        const { name } = req.query
        // if (file && name) {
        try {
            await rename(`data/${file}.json`, `data/${name}.json`)
            res.send(name)
        } catch (e) {
            console.error(e)
        }
        // } else next()
    });

    app.delete(async (req, res, next) => {
        const { file } = req.params
        try {
            await rm(`data/${file}.json`)
            res.send(file)
        } catch (e) {
            console.error(e)
        }
    });
}