import { createReadStream, createWriteStream } from "fs";
import { readdir, rm } from "fs/promises";
import { checkdir } from "$server/lib/utils.js";
import type { App } from "$server/derver/types.js";

export function files(app: App) {
    const pattern = '/:folder?/:file?'

    app.get(pattern, async (req, res) => {
        const { folder, file } = req.params

        await checkdir('files')

        if (file) {
            createReadStream(`files/${folder}/${file}`).pipe(res)
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

    app.put('/:from?/:to?', async (req, res) => {
        const { from, to } = req.params
        const file = req.query.file

        const source = createReadStream(`files/${from}/${file}`);
        const dest = createWriteStream(`files/${to}/${file}`);

        console.log(from, to, file)
        source.pipe(dest);
        source.on('end', async () => {
            await rm(`files/${from}/${file}`)
            res.send(file)
        });
        source.on('error', (e) => res.error(422, e.message));
    });

    app.delete(pattern, async (req, res, next) => {
        const { folder, file } = req.params

        try {
            await rm(`files/${folder}/${file}`, { recursive: true })
            res.send(`files/${folder}/${file} deleted`)
        } catch (e) {
            res.error(404, `${folder} or ${file} not found`)
            next()
        }
    })
}
