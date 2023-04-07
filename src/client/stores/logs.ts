import { derived, writable } from 'svelte/store'
import { del, get, post, put, patch } from "$client/api/methods.js";
import { uniq } from '$client/utils/index.js';
import { cache } from './cache.js';
import type { Params } from 'svelte-pathfinder';

export type Item = Record<string, any>

function createLogs() {
    const { set, subscribe, update, get: getStore } = cache<Item[]>('logs', [])
    return {
        update,
        subscribe,
        async get(query?: Params) {
            const { q, limit, page } = query || {}
            const logs = await get(`/logs/data/items?q=${q || ''}&limit=${limit || ''}&page=${page || ''}`)
            set(logs)
        },
        getID(id: number) {
            return getStore().find(l => l.id === id)
        },
        async getTotal() {
            return await get('/logs/data/items')
        }
        // async rename(file: string, name: string) {
        //     name = await patch(`/data/files/${file}?name=${name}`);
        //     update(state => uniq(state.map(f => (f === file ? name : f))))
        // },
        // async delete(file: string) {
        //     file = await del(`/data/files/${file}`)
        //     update(state => state.filter(s => s !== file))
        // }
    }
}
export const logs = createLogs()
