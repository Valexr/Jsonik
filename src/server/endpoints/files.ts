import { createReadStream, createWriteStream } from "fs";
import { readdir, rm, rename } from "fs/promises";
import { checkdir } from "$server/lib/utils.js";
import type { App, Req } from "$server/derver/types.js";

export function files(app: App) {
    const pattern = '/:folder?/:file?'

    app.get(pattern, async (req, res, next) => {
        const { folder, file } = req.params
        await checkdir('files')

        if (file) {
            createReadStream(`files/${folder}/${file}`).pipe(res)
        } else {
            try {
                const items = await readdir(`files/${folder}`)
                const files = items.filter(i => i.includes('.'))
                const root = await readdir(`files`)
                const folders = root.filter(i => !i.includes('.'))
                res.send({ files, folders, folder })
            } catch (e) {
                next()
            }
        }
    });

    app.post(pattern, async (req, res) => {
        const { folder, file } = req.params
        await checkdir(`files/${folder}`)

        if (file && file.includes('.')) {
            const stream = createWriteStream(`files/${folder}/${file}`);
            stream.on("open", () => req.pipe(stream));
            stream.on('close', () => res.send(`files/${folder}/${file} uploaded`))
            stream.on('error', (e) => res.error(422, e.message))
        } else {
            res.send(folder)
        }
    });

    app.patch(pattern, async (req, res, next) => {
        const { folder, file } = req.params
        try {
            await rename(`files/${folder}`, `files/${file}`)
            res.send(`files/${folder}/${file} renamed`)
        } catch (e) {
            next()
        }
    })

    app.delete(pattern, async (req, res, next) => {
        const { folder, file } = req.params
        try {
            await rm(`files/${folder}/${file}`, { recursive: true })
            res.send(`files/${folder}/${file} deleted`)
        } catch (e) {
            next()
        }
    })
}

function getBoundary(req: Req) {
    console.log(req)
    let contentType = req.headers['content-type']
    const contentTypeArray = contentType?.split(';').map(item => item.trim())
    console.log('contentTypeArray', contentTypeArray)
    const boundaryPrefix = '---'
    let boundary = contentTypeArray?.find(item => item.startsWith(boundaryPrefix))
    if (!boundary) return null
    boundary = boundary.slice(boundaryPrefix.length)
    if (boundary) boundary = boundary.trim()
    return boundary
}