// import { get } from 'svelte/store';
// import { session } from './auth';

const base = '/api/v1';
// const access = get(session).access

export default async function (url: RequestInfo, { ...options }: RequestInit, body?: BodyInit) {
    const isJson = options.headers?.['Content-Type' as keyof typeof options.headers] === 'application/json'
    console.log(body, isJson)
    function req() {
        return fetch(base + url, {
            ...options,
            credentials: 'include',
            // headers: {
            // ...(access && { Authorization: `Baerer ${access}` }),
            // 'Content-Type': 'application/json',
            // },
            body: body,
        });
    }
    try {
        const res = await req();
        // if (res.status === 401) {
        //     const ref = await refresh();
        //     if (ref.status === 200) {
        //         res = await req();
        //     } else {
        //         return { status: 400 }
        //         // goto(`/${get(history).lang}/auth`);
        //     }
        // } else
        if (res.status !== 200) throw new Error(await res.text());
        const text = res.headers.get('content-type') === 'text/plain'
        return text ? res.text() : res.json();
    } catch (e) {
        console.log('fetchError: ', e);
        throw e;
    }
}
