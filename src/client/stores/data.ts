import { writable } from 'svelte/store'
import { del, get, post, put, patch } from "$client/api/methods.js";
import { uniq } from '$client/utils/index.js';

export type Schema = Record<string, any>;
export type Collection = Record<string, Schema[]>
export type Item = Record<string, unknown>
export type Data = {
    schemas: Schema[]; keys: string[], items: Array<Item>
}

function createRecords() {
    const { set, subscribe, update } = writable<Data>()
    return {
        subscribe,
        async get(file = '') {
            const data = await get(`/data/${file}/records`)
            set(data)
        },
        async add(file = '', body: BodyInit) {
            const data = await post(`/data/${file}/records`, body, {
                headers: { 'Content-Type': 'application/json' }
            })
            set(data)
        },
    }
}
export const records = createRecords()

function createFiles() {
    const { set, subscribe, update } = writable<string[]>()
    return {
        update,
        subscribe,
        async get(file = '', table = '') {
            const files = await get(`/data/files/`)
            set(files)
        },
        async add(file = '', schemas?: Schema[]) {
            await post(`/data/${file}/schemas`, JSON.stringify(schemas), {
                headers: { 'Content-Type': 'application/json' }
            })
            update(state => uniq(state.concat(file)))
        },
        async rename(file = '', name = '') {
            name = await patch(`/data/files/${file}?name=${name}`);
            update(state => uniq(state.map(f => (f === file ? name : f))))
        },
        async delete(file: string) {
            file = await del(`/data/files/${file}`)
            update(state => state.filter(s => s !== file))
        }
    }
}
export const files = createFiles()

function createSchemas() {
    const { set, subscribe, update } = writable<Schema[] | undefined>()
    return {
        set,
        subscribe,
        async get(file = '') {
            const schemas = await get(`/data/${file}/schemas`)
            set(schemas)
        },
        async add(file = '', body?: object[]) {
            await post(`/data/${file}/schemas`, JSON.stringify(body), {
                headers: { 'Content-Type': 'application/json' }
            })
            files.update(state => !state.includes(file) ? state.concat(file) : state)
        },
        // async delete(file: string) {
        //     file = await del(`/data/${file}/`)
        //     update(state => state.filter(s => s !== file))
        // }
    }
}
export const schemas = createSchemas()

export const SCHEMAS = [
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