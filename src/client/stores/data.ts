import { writable } from 'svelte/store'
import { del, get, post } from "$client/api/methods.js";

export type Files = { files: string[], folders: string[], folder: string }

function createData() {
    const { set, subscribe, update } = writable<{ keys: string[], items: Array<Object & { date: number; }> }>()
    return {
        subscribe,
        async get(file = '', table = '') {
            const collection = await get(`/data/${file}/${table}`)
            set(collection)
        },
        // async add(folder = '', file?: File) {
        //     file = await post(`/files/${folder}/${file?.name}`, file);
        //     update(state => state.concat(String(file)))
        // },
        // async delete(folder = '', file = '') {
        //     await del(`/files/${folder}/${file}`);
        //     update(state => state.filter(f => f !== file))

        // }
    }
}

export const data = createData()

function createCollections() {
    const { set, subscribe, update } = writable<string[]>()
    return {
        subscribe,
        async get() {
            const collections = await get(`/data//`)
            set(collections)
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

export const collections = createCollections()