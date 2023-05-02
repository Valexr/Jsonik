import type { InputType } from 'zlib';
import type { OutgoingHttpHeaders, ServerResponse, IncomingMessage } from 'http';
import type { ParsedUrlQuery } from 'querystring';
import type { Base } from '$types/server.js';

export type Options = {
    port: number
    host: string
    serve: string
    index: string
    compress: boolean,
    cache: number,
    spa: boolean,
    watch?: () => void,
}

export type Req = {
    url: string | URL
    path: string;
    host: string
    hostname: string
    port: string
    search: string
    query: ParsedUrlQuery
    params: { [key: string]: string; }
    body: any
    file: string
    extname: string
    exists: boolean
    session: Record<string, any>
    cookie?: Record<string, string | number | boolean>
    token?: string
} & IncomingMessage & { base?: Base }

export type Res = {
    body: InputType
    cookie: (value: Record<string, string | number | boolean>) => void
    token: (value: string) => void
    send: <T>(message: T | string | string[] | Body) => void
    error: (code: number | undefined, message: string, headers?: OutgoingHttpHeaders) => void
} & ServerResponse

export type Next = (err?: any & Error) => void

export type Mw = ((req: Req, res: Res, next: Next) => Res | void | Promise<void>)

export type App = {
    list: () => Mw[];
    sub: (pattern: string, mw: (Mw | ((app: App) => void))) => void;
    use: (pattern: string | Mw, mw?: Mw) => void;
    get: (pattern: string | Mw, mw?: Mw) => void;
    post: (pattern: string | Mw, mw?: Mw) => void;
    put: (pattern: string | Mw, mw?: Mw) => void;
    patch: (pattern: string | Mw, mw?: Mw) => void;
    delete: (pattern: string | Mw, mw?: Mw) => void;
}