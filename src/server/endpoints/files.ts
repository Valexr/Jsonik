import { createReadStream, createWriteStream } from "fs";
import { readdir, rm, rename } from "fs/promises";
import { checkdir } from "$server/lib/utils.js";
import type { App } from "$server/http/types.js";

export function files(app: App) {
    const pattern = '/:folder?/:file?'

    app.get(pattern, async (req, res) => {
        const { folder, file } = req.params

        await checkdir('files')

        if (file) {
            const stream = createReadStream(`files/${folder}/${file}`)
            stream.on('error', (e) => res.error(422, e.message))
            stream.pipe(res)
        } else {
            try {
                const root = await readdir(`files`)
                const folders = root.filter(i => !i.includes('.'))
                const items = await readdir(`files/${folder}`)
                const files = items.filter(i => i.includes('.'))
                res.send({ files, folders })
            } catch (e) {
                res.error(404, `${folder} or ${file} not found`)
            }
        }
    });

    app.post(pattern, async (req, res) => {
        const { folder, file } = req.params

        await checkdir(`files/${folder}`)

        if (file && file.includes('.')) {
            const stream = createWriteStream(`files/${folder}/${file}`);
            stream.on("open", () => req.pipe(stream));
            stream.on('close', async () => res.send(file))
            stream.on('error', (e) => res.error(422, e.message))
        } else {
            res.send(folder)
        }
    });

    app.patch(pattern, async (req, res) => {
        const { folder, file } = req.params
        const { name } = req.query
        try {
            if (file) {
                await rename(`files/${folder}/${file}`, `files/${folder}/${name}`)
            } else {
                await rename(`files/${folder}`, `files/${name}`)
            }
            res.send(name)
        } catch (e: any & Error) {
            res.error(404, e.message)
        }
    })

    app.put('/:from?/:to?', async (req, res) => {
        const { from, to } = req.params
        const file = req.query.file
        try {
            const source = createReadStream(`files/${from}/${file}`);
            const dest = createWriteStream(`files/${to}/${file}`);

            source.pipe(dest);
            source.on('end', async () => {
                await rm(`files/${from}/${file}`)
                res.send(file)
            });
            source.on('error', (e) => res.error(422, e.message));
            dest.on('error', (e) => res.error(422, e.message));
        } catch (e: any & Error) {
            res.error(404, e.message)
        }
    });

    app.delete(pattern, async (req, res, next) => {
        const { folder, file } = req.params

        try {
            await rm(`files/${folder}/${file}`, { recursive: true })
            res.send(`files/${folder}/${file} deleted`)
        } catch (e) {
            res.error(404, `${folder} ${file} not found`)
        }
    })
}
