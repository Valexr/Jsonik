import { writable } from 'svelte/store'
import { del, get, post } from "$client/api/methods.js";
import type { Schema } from '$client/routes/data/field.svelte';

export type Data = {
    schemas: Schema[]; keys: string[], items: Array<Object & { date: number; }>
}

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
        async get(file = '', table = '') {
            const collections = await get(`/data/${file}/${table}`)
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

function createSchema() {
    const { set, subscribe, update } = writable<Schema[]>()
    return {
        subscribe,
        async get(file = '', table = '') {
            const collections = await get(`/data/${file}/${table}`)
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

export const schema = createSchema()

export const schemas = [
    {
        type: 'text',
        name: 'text',
        opts: {
            minlength: 0,
            maxlength: 0,
            pattern: '^\\w+$',
        }
    },
    {
        type: 'number',
        name: 'number',
        opts: {
            min: 0,
            max: 0,
            step: 1
        }
    },
    {
        type: 'checkbox',
        name: 'checkbox',
        opts: {}
    },
    {
        type: 'email',
        name: 'email',
        opts: {}
    },
    {
        type: 'url',
        name: 'url',
        opts: {}
    },
    {
        type: 'select',
        name: 'select',
        opts: {}
    },
    {
        type: 'date',
        name: 'date',
        opts: {}
    },
    {
        type: 'file',
        name: 'file',
        opts: {}
    },
    {
        type: 'markdown',
        name: 'markdown',
        opts: {}
    },
    {
        type: 'json',
        name: 'json',
        opts: {}
    },
]