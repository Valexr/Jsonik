import fetch from './fetch.js';

async function get(url: string) {
    return fetch(url, { method: 'GET' });
}

async function post(url: string, payload?: BodyInit, options?: RequestInit) {
    return fetch(url, { method: 'POST', ...options }, payload);
}

async function put(url: string, payload?: BodyInit) {
    return fetch(url, { method: 'PUT' }, payload);
}

async function patch(url: string, payload?: BodyInit) {
    return fetch(url, { method: 'PATCH' }, payload);
}

async function del(url: string) {
    return fetch(url, { method: 'DELETE' });
}

export { get, post, put, patch, del };
