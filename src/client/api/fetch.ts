// import { get } from 'svelte/store';
// import { session } from './auth';

const base = '/api/v1';
// const access = get(session).access

export default async function <T>(url: RequestInfo, { ...options }: RequestInit, body?: BodyInit): Promise<any & T> {
    console.log(body)
    try {
        const res = await fetch(base + url, {
            ...options,
            headers: {
                Authorization: 'Baerer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlF1aW5jeSBMYXJzb24iLCJpYXQiOjE1MTYyMzkwMjJ9.OGVhYzBjZDM2M2FkOTc4ZGY4MjNmZWM4MWZhNWE5MjI4ZWNkN2M1MTZmY2JmNTFjODZkNzg1ZDM0N2U0NmMwMA==',
            },
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
