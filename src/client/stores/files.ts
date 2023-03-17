import { writable } from 'svelte/store'
import { del, get, post, put } from "$client/api/methods.js";

export type Files = { files: string[], folders: string[], folder: string }

function createFiles() {
    const { set, subscribe, update } = writable<string[]>()
    return {
        subscribe,
        async get(folder = '', file = '') {
            const { files } = await get(`/files/${folder}/${file}`)
            set(files)
        },
        async add(folder = '', file?: File) {
            file = await post(`/files/${folder}/${file?.name}`, file);
            update(state => state.concat(String(file)))
        },
        async move(from = '', file: string, to = '') {
            file = await put(`/files/${from}/${to}`, JSON.stringify(file), {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(file)
            update(state => state.filter(f => f !== file))
        },
        async delete(folder = '', file = '') {
            await del(`/files/${folder}/${file}`);
            update(state => state.filter(f => f !== file))
        }
    }
}

export const files = createFiles()

function createFolders() {
    const { set, subscribe, update } = writable<string[]>()
    return {
        set, subscribe, update,
        async get() {
            const { folders } = await get(`/files//`)
            set(folders)
        },
        async add(folder = '') {
            folder = await post(`/files/${folder}/`);
            update(state => state.concat(folder))
        },
        async delete(folder = '') {
            await del(`/files/${folder}/`);
            update(state => state.filter(f => f !== folder))

        }
    }
}

export const folders = createFolders()