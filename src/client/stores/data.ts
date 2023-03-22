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
        async add(file = '', table = '', body: BodyInit) {
            const collection = await post(`/data/${file}/${table}`, body, {
                headers: { 'Content-Type': 'application/json' }
            })
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
        async add(file = '', table = 'items', body?: object[]) {
            await post(`/data/${file}/${table}`, JSON.stringify(body), {
                headers: { 'Content-Type': 'application/json' }
            })
            update(state => state.concat(String(file)))
        },
        async delete(file: string) {
            file = await del(`/data/${file}/`)
            update(state => state.filter(s => s !== file))

        }
    }
}

export const collections = createCollections()

export const schemas = {
    text: {
        value: '',
        minlength: 0,
        maxlength: 0
    },
    number: {
        value: 0,
        min: 0,
        max: 0,
        step: 1
    },
    checkbox: {
        value: false
    },
    email: {
        value: ''
    },
    url: {
        value: ''
    },
    select: {
        value: ''
    },
    date: {
        value: ''
    },
    file: {
        value: ''
    },
    markdown: {
        value: ''
    },
    json: {
        value: ''
    },
}