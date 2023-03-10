import { rm } from 'fs/promises';

export default async function remove(paths = []) {
    try {
        for await (const path of paths) {
            rm(path, { recursive: true, force: true });
        }
    } catch {
        console.error(`${paths}`);
    }
}
