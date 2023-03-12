import { createReadStream, createWriteStream } from "node:fs";
import { readdir, rm } from "node:fs/promises";
import { checkdir } from "$server/lib/utils";
import type { App } from "$server/derver/types";

export function files(app: App) {
    const pattern = '/:folder?/:file?'

    app.get(pattern, async (req, res, next) => {
        console.log(req.params)
        const { folder, file } = req.params
        await checkdir('files')
        if (req.params.file) {
            createReadStream(`files/${folder}/${file}`).pipe(res)
        } else {
            try {
                const items = await readdir(`files/${folder}`)
                const files = items.filter(i => i.includes('.'))
                const root = await readdir(`files`)
                const folders = root.filter(i => !i.includes('.'))
                res.send<{ files: string[], folders: string[], folder: string }>({ files, folders, folder })
            } catch (e) {
                next()
            }
        }
    });

    app.post(pattern, async (req, res) => {
        console.log(req.params)
        const { folder, file } = req.params
        await checkdir(`files/${folder}`)
        if (file && file.includes('.')) {
            const stream = createWriteStream(`files/${folder}/${file}`);
            stream.on("open", () => req.pipe(stream));
        } else {
            res.send(folder)
        }
    });

    app.delete(pattern, async (req, res) => {
        const { folder, file } = req.params
        await rm(`files/${folder}`, { recursive: true })
    })
}