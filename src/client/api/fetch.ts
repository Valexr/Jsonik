// import { get } from 'svelte/store';
// import { session } from './auth';

const base = '/api/v1';
// const access = get(session).access

export default async function <T>(url: RequestInfo, { ...options }: RequestInit, body?: BodyInit): Promise<any & T> {
    console.log(body)
    try {
        const res = await fetch(base + url, {
            ...options,
            credentials: 'include',
            body: body,
        });
        if (res.status !== 200) throw new Error(await res.text());
        const text = res.headers.get('content-type') === 'text/plain'
        return text ? res.text() : res.json();
    } catch (e) {
        throw e;
    }
}
