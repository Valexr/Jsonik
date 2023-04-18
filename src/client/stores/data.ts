import { derived, writable } from 'svelte/store'
import { files as Files } from '$client/stores/files.js'
import { del, get, post, put, patch } from "$client/api/methods.js";
import { uniq } from '$client/utils/index.js';
import { gettable } from './gettable.js';
import { cache } from './cache.js';
import type { Schema } from './schemas.js';

export type Item = Record<string, any>
export type Key = Record<string, string>

function createCollections() {
    const { set, subscribe, update } = cache<string[]>('collections', [])
    return {
        update,
        subscribe,
        async get() {
            const files = await get(`/data/`)
            set(files)
        },
        async rename(file: string, name: string) {
            name = await patch(`/data/${file}?name=${name}`);
            update(state => uniq(state.map(f => (f === file ? name : f))))
        },
        async delete(file: string) {
            file = await del(`/data/${file}`)
            update(state => state.filter(s => s !== file))
        }
    }
}
export const collections = createCollections()

function createRecords() {
    const { set, subscribe, update, get: getValue } = gettable<Item[]>([])

    return {
        subscribe,
        id: (id: number) => getValue().find(v => v.id === id),
        async get(file = '', query = '') {
            const records = await get(`/data/${file}/records${query}`)
            set(file ? records : [])
            if (!file) throw Error('file not found')
        },
        async set(file: string, record: Item) {
            const records = await post(`/data/${file}/records`, JSON.stringify(record), {
                headers: { 'Content-Type': 'application/json' }
            })
            set(records)
        },
        async update(file: string, records: Item[]) {
            const updated = await put(`/data/${file}/records`, JSON.stringify(records), {
                headers: { 'Content-Type': 'application/json' }
            })
            update(() => updated)
        },
        async upkeys(file: string, keys: Item) {
            const records = await patch(`/data/${file}/records`, JSON.stringify(keys), {
                headers: { 'Content-Type': 'application/json' }
            })
            update(() => records)
        },
        async deleteFiles(file = '', fileNames: string[]) {
            if (!getValue().length) await this.get(file)
            const records = fileNames.reduce<Array<Item>>((a, filename) => {
                const [recordID, field, ...name] = filename.split('-')
                if (name) {
                    const record = this.id(Number(recordID))
                    if (record) {
                        record[field] = record[field].filter((f: File) => f.name !== filename)
                        a.push(record)
                    }
                }
                return uniq(a)
            }, [])

            await this.update(file, records)
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
    const { set, subscribe, update, get: getValue } = gettable<Schema[]>([])

    return {
        update,
        subscribe,
        async get(file = '') {
            const schemas = await get(`/data/${file}/schemas`)
            set(file ? schemas : [])
        },
        async set(file: string, schemas: Schema[]) {
            await post(`/data/${file}/schemas`, JSON.stringify(schemas), {
                headers: { 'Content-Type': 'application/json' }
            })
            update(state => schemas)
            collections.update(state => uniq(state.concat(file)))
        },
        add: (schema: Schema[]) => update(state => state.concat(schema)),
        invalidate: (id?: number) => update((state) =>
            state.map((s) => s.id === id ? { ...s, valid: false } : s)
        ),
        save: (schema?: Schema) => update(state =>
            state.map((s) => (schema?.id === s.id ? { ...schema, valid: true } : s))
        ),
        move: (from: number, to: number) => update(state => {
            state.splice(to, 0, state.splice(from, 1)[0])
            return state
        }),
        type: (fieldname: string) => getValue().find(v => v.name === fieldname)?.type,
        cleanup: () => update(state => state.map(({ prevName, ...schema }) => schema)),
        delete: (id?: number) => update(state => state.filter(s => s.id !== id)),
        clear: () => set([]),
    }
}
export const schemas = createSchemas()
export const schemaType = (fieldname: string) => derived(schemas, $schemas => $schemas?.find(v => v.name === fieldname)?.type)
export const schemaInvalID = derived(schemas, $schemas => $schemas?.find((s) => !s.valid)?.id)
export const schemaNames = derived(schemas, $schemas => $schemas?.map(({ name }) => name))
export const schemasKeys = derived(schemas, $schemas => $schemas?.reduce<Key>((a, { prevName, name }) => {
    a[prevName || name] = name;
    return a;
}, {}))
