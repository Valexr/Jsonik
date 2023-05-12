import { Low, type Adapter } from 'lowdb';
import { TextFile } from 'lowdb/node';
import { checkdir, match, isFunction } from '$server/lib/utils';
import type { Base, Doc, Query } from '$types/server';

class JSONFile<T> implements Adapter<T> {
    #adapter: TextFile

    constructor(filename: string) {
        this.#adapter = new TextFile(filename)
    }

    async read(): Promise<T | null> {
        const data = await this.#adapter.read()
        if (data === null) {
            return null
        } else {
            return JSON.parse(data) as T
        }
    }

    write(obj: T): Promise<void> {
        return this.#adapter.write(JSON.stringify(obj, null, 2))
    }
}

export async function db<T>(path: string) {
    await checkdir(path)
    return new Low<Array<T & Doc>>(new JSONFile(path), []);
}

export async function base<T>(path: string): Promise<Base<T>> {

    const base = await db<T>(path);
    await base.read();

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
            console.log(found, update)
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
