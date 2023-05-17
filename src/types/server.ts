export type Doc = Record<string, any>
export type Query = Doc | ((doc: Doc, i: number) => boolean)
export type Update<T> = Doc[] | ((doc: Doc, i: number) => Doc & T)

export type Db<T> = {
    data: (T & Doc)[];
    read: () => Promise<void>;
    write: () => Promise<void>;
}

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

export type Schema = {
    id: number,
    type: string,
    name: string,
    opts: Record<string, string | number | boolean>,
    valid?: boolean,
    required?: boolean
    prevName?: string,
    icon?: string
};
