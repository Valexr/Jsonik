import { writeFile } from 'fs/promises';

export default async function meta(bundle, name = 'meta') {
    return await writeFile(`${name}.json`, JSON.stringify(bundle.metafile));
}