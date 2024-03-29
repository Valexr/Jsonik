import { createReadStream, createWriteStream } from "fs";
import { readdir, rm, rename } from "fs/promises";
import { checkpath } from "$server/lib/utils";
import type { App, Req, Res } from "$server/http/types";

export function files(app: App) {
    const pattern = '/:folder?/:file?'

    app.get(pattern, async (req, res, next) => {
        const { folder, file } = req.params

        await checkpath('files')

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
                res.error(404, `${folder || file} not found`)
            }
        }
    });

    app.post(pattern, async (req, res, next) => {
        const { folder, file } = req.params

        await checkpath(`files/${folder}`)

        if (file && file.includes('.')) {
            // const filePath = await uploadFile(req, res, `files/${folder}/${file}`)
            // res.send(file)
            const stream = createWriteStream(`files/${folder}/${file}`);
            stream.on("open", () => req.pipe(stream));
            stream.on('close', async () => res.send(file))
            stream.on('error', (e) => res.error(422, e.message))
            next()
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

    app.put('/:from?/:to?', (req, res) => {
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
            res.error(404, `${folder || file} not found`)
        }
    })
}


function uploadFile(req: Req, res: Res, filePath: string) {
    return new Promise((resolve, reject) => {
        const stream = createWriteStream(filePath);
        // With the open - event, data will start being written
        // from the request to the stream's destination path
        stream.on('open', () => {
            console.log('Stream open ...  0.00%');
            req.pipe(stream);
        });

        // Drain is fired whenever a data chunk is written.
        // When that happens, print how much data has been written yet.
        stream.on('drain', () => {
            const written = stream.bytesWritten
            const total = Number(req.headers['content-length'])
            const pWritten = ((written / total) * 100).toFixed();
            res.sse('progress', pWritten)
            console.log(`Processing  ...  ${pWritten}% done`);
        });

        // When the stream is finished, print a final message
        // Also, resolve the location of the file to calling function
        stream.on('close', () => {
            console.log('Processing  ...  100%');
            resolve(filePath);
        });
        // If something goes wrong, reject the primise
        stream.on('error', err => {
            console.error(err);
            reject(err);
        });
    });
}