// import { get } from 'svelte/store';
// import { session } from './auth';

const base = '/api';
// const access = get(session).access

export default async function <T>(url: RequestInfo, { ...options }: RequestInit, body?: BodyInit): Promise<any & T> {
    console.log(body)
    try {
        const res = await fetch(base + url, {
            ...options,
            // headers: {
            // 'Access-Control-Allow-Origin': '*'
            //     Authorization: 'Baerer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjJ9.OWQ0MjQ0NWY5MWUxMmVjYzRjYTg0OGVlNTQ1ZjUwY2U1YTYzN2E5YmFkOWQ5ZjRiN2ZhZDY0MGM1ZGJlMzI5Ng==',
            // },
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
