import { readFile, writeFile } from "fs/promises"
import { checkpath, match, isFunction, checkfile } from '$server/lib/utils';
import type { Base, Doc, Query } from '$types/server';

export async function db<T>(path: string) {
    await checkpath(path)

    const read = async () => JSON.parse(await checkfile(path) || '[]')
    const data: Array<T & Doc> = await read()

    return {
        data, read,
        write() {
            return writeFile(path, JSON.stringify(this.data, null, '\t'), 'utf8')
        }
    }
}

export async function base<T>(path: string): Promise<Base<T>> {

    const base = await db<T>(path);

    function find(query?: Query) {
        if (!query || !Reflect.ownKeys(query).length) return base.data
        return base.data.filter((doc, i) =>
            isFunction(query) ? query(doc, i) : match(doc, query))
    }

    return {
        data: base.data,
        find,
        async insert(docs, index = base.data.length) {
            base.data.splice(index, 0, ...docs)
            await base.write()
            return base.data
        },
        async upsert(query, docs) {
            const found = find(query)
            for (const doc of docs) {
                const i = found.findIndex(({ id }) => id === doc.id);
                if (i > -1) Object.assign(found[i], doc);
                else found.push(doc);
            }
            base.data = found
            await base.write()
            return base.data
        },
        async update(query, update) {
            const found = find(query)
            base.data = found.map((doc, i) =>
                isFunction(update) ? update(doc, i) : Object.assign(doc, update));
            await base.write();
            return base.data;
        },
        async delete(query) {
            const found = find(query)
            base.data = base.data.filter((doc) => !found.includes(doc))
            await base.write()
            return base.data
        },
        async set(docs) {
            base.data = docs
            await base.write()
            return base.data
        },
        async get() {
            await base.read()
            return base.data
        },
        count(query) {
            const found = find(query)
            return found.length
        }
    };
}
