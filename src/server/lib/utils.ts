import { dirname, extname } from 'path'
import { mkdir, readFile, writeFile } from 'fs/promises';

export function compare(doc: Record<string, any>, query: Record<string, any>) {
    const tmp = { ...doc, ...query }
    return JSON.stringify(doc) === JSON.stringify(tmp)
}

export function match(doc: Record<string, any>, query: Record<string, any>) {
    return Object.entries(query).every(([k, v]) => doc[k] === v)
}

export function isFunction(target: unknown): target is (...args: any) => any {
    return typeof target === 'function';
}

export async function checkpath(path: string) {
    try {
        path = !!extname(path) ? dirname(path) : path
        await mkdir(path, { recursive: true });
    } catch (e) {
        console.error(e)
    }
}
export async function checkfile(path: string) {
    try {
        const data = await readFile(path, { encoding: 'utf8' });
        return data
    } catch (e) {
        console.error(e)
        await writeFile(path, []);
    }
}

export function upKeys(item: Record<string, any>, keys: Record<string, string>) {
    const { id, updated } = item
    const mapper = ([k, v]: [string, string]) => ({ [v]: item[k] || '' })
    const entries = Object.entries(keys).map(mapper)
    return Object.assign({ id }, ...entries, { updated })
}