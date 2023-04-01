import { derived, writable } from 'svelte/store'
import { del, get, post, put, patch } from "$client/api/methods.js";
import { uniq } from '$client/utils/index.js';

export type Schema = Record<string, any>
// {
//     type: string,
//     name: string,
//     opts: Record<string, string | number>,
//     id?: number,
//     valid?: boolean,
// } | undefined;
export type Collection = Record<string, Schema[]>
export type Item = Record<string, unknown>
export type Key = string & { type: string; name: string }
export type Data = {
    schemas: Array<Schema>; keys: Array<Key>, records: Array<Item>
}

function createCollection() {
    const { set, subscribe, update } = writable<Data>()

    return {
        subscribe,
        async get(file = '', id = 0) {
            const data = await get(`/data/${file}/records}`)
            set(data)
            return data
        },
        async add(file = '', body: Record<string, any>) {
            const records = await post(`/data/${file}/records`, JSON.stringify(body), {
                headers: { 'Content-Type': 'application/json' }
            })
            set(records)
        },
        async update(file = '', body: Record<string, any>) {
            const records = await put(`/data/${file}/records`, JSON.stringify(body), {
                headers: { 'Content-Type': 'application/json' }
            })
            update((state) => Object.assign(state, { records }))
        },
        async del(file = '', IDs: Array<number>) {
            const records = await del(`/data/${file}/records`, JSON.stringify(IDs), {
                headers: { 'Content-Type': 'application/json' }
            })
            update((state) => Object.assign(state, { records }))
        }
    }
}
export const collection = createCollection()

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
    const { set, subscribe, update } = writable<Schema[]>([])
    return {
        set,
        update,
        subscribe,
        async get(file = '') {
            const schemas = await get(`/data/${file}/schemas`)
            set(schemas)
        },
        async upload(file = '', body?: object[]) {
            await post(`/data/${file}/schemas`, JSON.stringify(body), {
                headers: { 'Content-Type': 'application/json' }
            })
            files.update(state => uniq(state.concat(file)))
        },
        add: (schema: Schema[]) => update(state => state.concat(schema)),
        invalidate: (id: number) => update((state) =>
            state.map((s) => s.id === id ? { ...s, valid: false } : s)
        ),
        save: (schema: Schema) => update(state =>
            state.map((s) => (schema.id === s.id ? { ...schema, valid: true } : s))
        ),
        del: (id: number) => update(state => state.filter(s => s.id !== id)),
        clear: () => set([]),
    }
}
export const schemas = createSchemas()
export const schemaInvalid = derived(schemas, $schemas => $schemas?.find((s) => !s.valid)?.id)

export const SCHEMAS = [
    {
        type: 'text',
        name: 'text',
        opts: {
            minlength: 0,
            maxlength: 0,
            pattern: 'e.g. ^\\w+$',
        }
    },
    {
        type: 'textarea',
        name: 'textarea',
        opts: {
            minlength: 0,
            maxlength: 0,
        }
    },
    {
        type: 'number',
        name: 'number',
        opts: {
            min: 0,
            max: 0
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
        opts: {
            domains: 'allowed domains'
        }
    },
    {
        type: 'url',
        name: 'url',
        opts: {
            domains: 'allowed domains'
        }
    },
    {
        type: 'select',
        name: 'select',
        opts: {
            options: 'opt0, opt1, opt2...',
            max: 1
        }
    },
    {
        type: 'date',
        name: 'date',
        opts: {
            min: 0,
            max: 0
        }
    },
    {
        type: 'time',
        name: 'time',
        opts: {
            min: 0,
            max: 0
        }
    },
    {
        type: 'file',
        name: 'file',
        opts: {}
    },
    {
        type: 'json',
        name: 'json',
        opts: {}
    },
    {
        type: 'markdown',
        name: 'markdown',
        opts: {}
    },
]