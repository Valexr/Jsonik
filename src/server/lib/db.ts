import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { omatch, osome, group, checkdir } from '$server/lib/utils.js';
import type { Base } from '$types/server.js';
import { Item, Key } from '$client/stores/data.js';

const dbs: { [file: string]: Low<any> } = {};

export async function db(file: string) {
    const [folder] = file.split('/')
    await checkdir(folder)
    dbs[file] ||= new Low(new JSONFile(file));
    return dbs[file];
}

export async function base(file: string, table = 'items'): Promise<Base | undefined> {
    try {
        const base = await db(file);
        await base.read();

        base.data ||= {};
        base.data[table] ||= [];

        return {
            base,
            data: base.data,
            table: base.data[table],
            assign: async (data) => {
                Object.assign(base.data, data)
                await base.write();
                return base.data[table]
            },
            write: async () => await base.write(),
            id: (id) => base.data[table].find((i: Item) => i.id === id),
            find: (prop) => base.data[table].find((i: Item) => Object.entries(prop).every(([k, v]) => i[k] === v)),
            search: (query) => base.data[table].filter((o: Item) => osome(o, query)),
            match: (query) => base.data[table].filter((o: Item) => omatch(o, query)),
            prepend: async (obj) => {
                base.data[table].unshift(obj);
                await base.write();
                return base.data[table];
            },
            append: async (obj, meta) => {
                base.data[table].push({ ...obj, ...meta });
                await base.write();
                return base.data[table];
            },
            upkeys: async (keys: Record<string, string>) => {
                base.data[table] = base.data[table].map((t: Record<string, any>) => updateRecordKeys(t, keys))
                await base.write();
                return base.data[table];
            },
            update: async (meta) => {
                base.data[table].forEach((i: Item) => i.id === meta?.id && Object.assign(i, meta));
                await base.write();
                return base.data[table];
            },
            patch: async (query) => {
                base.data[table].forEach((i: Item) =>
                    Object.assign(i, { [query]: i.languages.map((l: Item) => l.name) }));
                await base.write();
            },
            deleteIDs: async (IDs: Array<number>) => {
                base.data[table] = base.data[table].filter(({ id }: Item) => !IDs.includes(id));
                await base.write();
                return base.data[table];
            },
            delete: async (query) => {
                base.data[table] = base.data[table].filter((o: Item) => !omatch(o, query));
                await base.write();
                return base.data[table];
            },
            deleteprop: async (query) => {
                base.data[table] = base.data[table].forEach((o: Item) => delete o[query]);
                await base.write();
                return base.data[table];
            },
            replace: async (query, obj) => {
                base.data[table] = base.data[table].filter((o: Item) => !omatch(o, query));
                base.data[table].push(obj);
                await base.write();
                return base.data[table];
            },
            filters: (query) => {
                const qa =
                    typeof query === 'string'
                        ? query
                            .slice(1)
                            .split('&')
                            .map((q) => {
                                const s = q.split('=');
                                return { [s[0]]: s[1] };
                            })
                        : Object.entries(query).map(([k, v]) => {
                            return { [k]: v };
                        });
                const filters = Object.keys(query)
                    .filter((q) => q !== 'q' && q !== 'id')
                    .reduce((a, k, i) => {
                        const items = i === 0 ? base.data[table] : base.data[table]
                            .filter((o: Item) => omatch(o, qa[i - 1]));
                        const vals = Object.keys(group(items, [k])).filter(Boolean);
                        const val = [...new Set(`${vals}`.split(',').sort())];
                        return { ...a, [k]: val };
                    }, {});

                return filters;
            },
        };
    } catch (err) {
        console.log('dbERR:', err);
    }
}

function upRecordKeys(obj: Record<string, any>, newKeys: Record<string, string>) {
    console.log(obj, newKeys)
    const { id, updated } = obj
    const renamedEntries = Object.keys(obj).map(key => {
        if (key in newKeys) {
            const newKey = newKeys[key] || key;
            return { [newKey]: obj[key] };
        }
    }).filter(Boolean);

    const newEntries = Object.entries(newKeys).map(([k, v]) => {
        if (!(k in obj) && !(v in obj)) {
            return { [v]: '' }
        }
    }).filter(Boolean)

    console.log(renamedEntries, newEntries)

    return Object.assign({ id }, ...renamedEntries, ...newEntries, { updated });
}


function updateRecordKeys(object: Item, keys: Key) {
    const replaced: Key = {};
    const mut: Key = {};

    for (const key in keys) {
        if (object[key]) {
            replaced[key] = object[key];
            mut[keys[key]] = object[key];

            if (!mut[key]) delete object[key];
        }
    }

    return Object.assign(object, mut);
}