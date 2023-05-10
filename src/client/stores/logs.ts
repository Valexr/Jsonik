import { getable } from './getable';
import { del, get, post, put, patch } from "$client/api/methods";
import type { Params } from 'svelte-pathfinder';

export type Log = { docs: Record<string, any>[], total: number }

function createLogs() {
    const { set, subscribe, update, get: getStore } = getable<Log>({ docs: [], total: 0 })
    return {
        update,
        subscribe,
        async get(query?: Params) {
            const { q, limit, page } = query || {}
            const logs = await get(`/logs/data/items?q=${q || ''}&limit=${limit || ''}&page=${page || ''}`)
            set(logs)
        },
        async getTotal() {
            return await get('/logs/data/items')
        },
        getID: (id: number) => getStore().docs.find(l => l.id === id)
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
