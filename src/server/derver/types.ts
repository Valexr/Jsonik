import type { PathLike } from 'fs';
import type { InputType } from 'zlib';
import type { OutgoingHttpHeaders, ServerResponse, IncomingMessage } from 'http';

export type Options = {
    port: number
    host: string
    serve: string
    index: string
    compress: boolean,
    cache: number,
    spa: boolean,
    livereload?: boolean,
} & { middlewares: App }

export type Req = {
    url: string | URL
    path: string;
    host: string
    hostname: string
    port: string
    search: string
    query: { [key: string]: string }
    params: { [key: string]: string; }
    body: Body & PathLike | string | string[]
    file: string
    extname: string
    exists: boolean
} & IncomingMessage

export type Res = {
    body: InputType
    send: <T>(message: T | string | string[] | Body) => void
    error: (code: number | undefined, message: string, headers?: OutgoingHttpHeaders) => void
} & ServerResponse

export type Next = () => void

export type Mw = ((req: Req, res: Res, next: Next) => void) | null

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