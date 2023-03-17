import { writable } from 'svelte/store'
import { del, get, post } from "$client/api/methods.js";

export type Data = { keys: string[], items: Array<Object & { date: number; }> }

function createData() {
    const { set, subscribe, update } = writable<Data>()
    return {
        subscribe,
        async get(file = '', table = '') {
            const collection = await get(`/data/${file}/${table}`)
            set(collection)
        },
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
    }
}

export const collections = createCollections()