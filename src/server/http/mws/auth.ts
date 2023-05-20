import type { Next, Req, Res } from "../types";

export function cors(req: Req, res: Res, next: Next) {
    // res.cors = (code = 200, headers: Record<string, string>) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    // res.end()
    next()
}

export async function cookie(req: Req, res: Res, next: Next) {
    if (req.headers.cookie) {
        req.cookie = parse(req.headers.cookie)
    }
    res.cookie = (value: Record<string, string | number | boolean>) => {
        res.setHeader('Set-Cookie', stringify(value));
    }

    function parse(str: string): Record<string, string | number | boolean> {
        const entries = str.split(/;\s?/).map(v => decodeURIComponent(v).split(/=(.+)/))
        return Object.fromEntries(entries)
    }

    function stringify(cookies: Record<string, string | number | boolean>) {
        return Object.entries(cookies)
            .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
            .join('; ');
    }
    next()
}

export async function token(req: Req, res: Res, next: Next) {
    if (req.headers.authorization) {
        const [baerer, token] = req.headers.authorization.split(' ')
        req.token = baerer ? token : undefined
    }
    res.token = (token: string) => {
        res.setHeader('Authorization', `Baerer ${token}`);
    }
    next()
}