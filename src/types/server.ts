import type { Low } from "lowdb";

export type Doc = Record<string, any>
export type Query = Doc | ((doc: Doc, i: number) => boolean)
export type Update<T> = Doc[] | ((doc: Doc, i: number) => Doc & T)

export type Base<T> = {
    data: Array<T & Doc>;
    find: (query?: Query) => (T & Doc)[],
    insert: (docs: Array<T & Doc>, index?: number) => Promise<(T & Doc)[]>
    upsert: (query: Query, docs: Array<T & Doc>) => Promise<(T & Doc)[]>
    update: (query: Query, update: Update<T>) => Promise<(T & Doc)[]>,
    delete: (query?: Query) => Promise<(T & Doc)[]>
    set: (docs: Array<T & Doc>) => Promise<(T & Doc)[]>
    get: () => Promise<(T & Doc)[]>
    count: (query?: Query) => number
}

export type Session = {
    id: number,
    userid: number,
    role: string,
    email: string,
    remember: boolean,
    maxAge: number,
    ip: string,
    ua: string,
    create: string,
    exp: string
}

export type User = {
    email: string,
    password: string,
    role: string,
    id: number,
    create: number,
    update: number,
    refresh_token: string
}

// /** Checking the object for storage suitability. */
// export type Acceptable<T extends Document> = { [K in keyof T]: T[K] & DocValue };

// /** Any document-like object. */
// export type Doc = { [key: string]: DocValue };

// /** Array of document values. */
// export type DocArray = DocValue[];

// /** Supported documents values. */
// export type DocValue = DocPrimitive | Document | DocArray;

// /** Supported primitives. */
// export type DocPrimitive = string | number | boolean | null;

// /** Documents selection criteria. */
// export type Query<T extends Doc = Doc> = { [K in keyof T]?: QueryValue<T[K]> };

// /** Possible search query values. */
// export type QueryValue<T extends DocValue = DocValue> = DocValue | ((value: Readonly<T>) => boolean) | RegExp | undefined;

// /** Manual documents selection function. */
// export type QueryFunction<T extends Doc = Doc> = (doc: Readonly<T>, i: number) => boolean;

// /** The modifications to apply. */
// export type Update<T extends Doc = Doc> = { [K in keyof T]?: UpdateValue<T[K]> };

// /** Possible update values. */
// export type UpdateValue<T extends DocValue = DocValue> = T | ((value: T) => T) | undefined;

// /** Manual modifications applying. */
// export type UpdateFunction<T extends Doc = Doc> = (doc: T) => T | null;