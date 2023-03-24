import type { Low } from "lowdb";

export type Base = {
    base: Low<object>;
    data: any;
    table: Low<any>;
    addTable: (data: any[]) => Promise<void>
    write: () => Promise<void>;
    id: (id: number | string) => any;
    find: (prop: object) => any;
    search: (query: string) => any;
    match: (query: object) => any;
    prepend: (obj: object, meta?: object) => Promise<any>;
    append: (obj: object, meta?: object) => Promise<any>;
    update: (id: number | string, meta?: Object) => Promise<any>;
    patch: (query: string, meta?: object) => Promise<void>;
    delete: (query: object) => Promise<any>;
    deleteprop: (query: string) => Promise<any>;
    replace: (query: object, obj: object) => Promise<any>;
    filters: (query: string | object) => {};
}