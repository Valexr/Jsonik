import { derived, writable } from 'svelte/store'
import { del, get, post, put, patch } from "$client/api/methods.js";
import { uniq } from '$client/utils/index.js';
import { cache } from './cache.js';

export type Schema = {
    type: string,
    name: string,
    opts: Record<string, string | number>,
    id: number,
    valid?: boolean,
    prevName?: string,
    required?: boolean
};
export type Item = Record<string, any>
export type Key = Record<string, string>

function createFiles() {
    const { set, subscribe, update } = cache<string[]>('files', [])
    return {
        update,
        subscribe,
        async get() {
            const files = await get(`/data/files/`)
            set(files)
        },
        async rename(file: string, name: string) {
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

function createRecords() {
    const { set, subscribe, update } = cache<Item[]>('records', [])

    return {
        subscribe,
        async get(file: string) {
            const records = await get(`/data/${file}/records`)
            set(records)
        },
        async set(file: string, record: Item) {
            const records = await post(`/data/${file}/records`, JSON.stringify(record), {
                headers: { 'Content-Type': 'application/json' }
            })
            set(records)
        },
        async update(file: string, record: Item) {
            const records = await put(`/data/${file}/records`, JSON.stringify(record), {
                headers: { 'Content-Type': 'application/json' }
            })
            update(() => records)
        },
        async upkeys(file: string, keys: Item) {
            const records = await patch(`/data/${file}/records`, JSON.stringify(keys), {
                headers: { 'Content-Type': 'application/json' }
            })
            update(() => records)
        },
        async delete(file: string, IDs: Array<number>) {
            const records = await del(`/data/${file}/records`, JSON.stringify(IDs), {
                headers: { 'Content-Type': 'application/json' }
            })
            update(() => records)
        }
    }
}
export const records = createRecords()

function createSchemas() {
    const { set, subscribe, update, get: getStore } = cache<Schema[]>('schemas', [])

    return {
        update,
        subscribe,
        async get(file: string) {
            const schemas = await get(`/data/${file}/schemas`)
            set(schemas)
        },
        async set(file: string) {
            this.cleanup()
            const schemas = getStore()
            await post(`/data/${file}/schemas`, JSON.stringify(schemas), {
                headers: { 'Content-Type': 'application/json' }
            })
            files.update(state => uniq(state.concat(file)))
        },
        keys: () => getStore().reduce<Key>((a, { prevName, name }) => {
            a[prevName || name] = name;
            return a;
        }, {}),
        add: (schema: Schema[]) => update(state => state.concat(schema)),
        invalidate: (id?: number) => update((state) =>
            state.map((s) => s.id === id ? { ...s, valid: false } : s)
        ),
        save: (schema?: Schema) => update(state =>
            state.map((s) => (schema?.id === s.id ? { ...schema, valid: true } : s))
        ),
        cleanup: () => update(state => state.map(({ prevName, ...schema }) => schema)),
        delete: (id?: number) => update(state => state.filter(s => s.id !== id)),
        clear: () => set([]),
    }
}
export const schemas = createSchemas()
export const schemaInvalid = derived(schemas, $schemas => $schemas?.find((s) => !s.valid)?.id)

export const SCHEMAS: Partial<Schema>[] = [
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
        opts: {
            accept: 'e.g. .doc,.docx,.xml',
            multiple: 1
        }
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