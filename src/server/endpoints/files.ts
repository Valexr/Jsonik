import { createReadStream, createWriteStream } from "node:fs";
import { readdir } from "node:fs/promises";
import { checkdir } from "$server/lib/utils";
import type { App } from "$server/derver/types";

export function files(app: App) {
    const pattern = '/:folder?/:file?'

    app.get(pattern, async (req, res) => {
        console.log(req.params)
        const { folder, file } = req.params
        if (req.params.file) {
            createReadStream(`files/${folder}/${file}`).pipe(res)
        } else {
            await checkdir('files')
            const files = await readdir(`files/${folder}`)
            res.send(files)
        }
    });

    app.post(pattern, async (req) => {
        const { folder, file } = req.params
        await checkdir(`files/${folder}`)
        const stream = createWriteStream(`files/${folder}/${file}`);
        stream.on("open", () => req.pipe(stream));
    });
}