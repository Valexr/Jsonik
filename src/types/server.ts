import type { Low } from "lowdb";

export type Base = {
    base: Low<object>;
    data: any;
    table: Low<any>;
    assign: <T>(data: T | object | ArrayLike<object>) => Promise<void>
    write: () => Promise<void>;
    id: (id: number | string) => any;
    find: (prop: object) => any;
    search: (query: string) => any;
    match: (query: object) => any;
    prepend: (obj: object, meta?: object) => Promise<any>;
    append: (obj: object, meta?: object) => Promise<any>;
    upKeys: <T> (keys: T & Record<string, string>) => Promise<void>
    upRecord: (meta?: Record<string, any>) => Promise<any>;
    patch: (query: string, meta?: object) => Promise<void>;
    deleteIDs: <T> (IDs: T & Array<number>) => Promise<any>
    delete: (query: object) => Promise<any>;
    deleteProp: (query: string) => Promise<any>;
    replace: (query: object, obj: object) => Promise<any>;
    filters: (query: string | object) => {};
}