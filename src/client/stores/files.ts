import { writable } from 'svelte/store'
import { cacheable } from './cacheable';
import { del, get, patch, post, put } from "$client/api/methods";
import { uniq } from '$client/utils';

export type Files = { files: string[], folders: string[], folder: string }

function createFiles() {
    const { set, subscribe, update } = writable<string[]>([])
    return {
        subscribe,
        async get(folder = '', file = '') {
            const { files } = await get(`/files/${folder}/${file}`)
            set(files)
        },
        async add(folder = '', file?: File, name?: string) {
            file = await post(`/files/${folder}/${name || file?.name}`, file);
            update(state => uniq(state.concat(String(file))))
        },
        async move(from = '', file: string, to = '') {
            file = await put(`/files/${from}/${to}?file=${encodeURI(file)}`);
            update(state => state.filter(f => f !== file))
        },
        async rename(folder = '', file: string, name = '') {
            await patch(`/files/${folder}/${file}?name=${name}`);
            update(state => state.map(f => (f === file ? name : f)))
        },
        async delete(folder = '', files: string[]) {
            const promises = files?.map((file) => {
                del(`/files/${folder}/${file}`)
            });
            await Promise.all(promises);
            update(state => state?.filter(f => !files?.includes(f)))
        }
    }
}

export const files = createFiles()

function createFolders() {
    const { set, subscribe, update } = writable<string[]>([])
    return {
        set, subscribe, update,
        async get() {
            const { folders } = await get(`/files//`)
            set(folders)
        },
        async add(folder = '') {
            folder = await post(`/files/${folder}/`);
            update(state => state.concat(folder))
        },
        async rename(folder = '', name = '') {
            await patch(`/files/${folder}/?name=${name}`);
            update(state => state.map(f => (f === folder ? name : f)))
        },
        async delete(folder = '') {
            try {
                await del(`/files/${folder}/`);
                update(state => state.filter(f => f !== folder))
            } catch (e) { }
        }
    }
}

export const folders = createFolders()