import fetch from './fetch.js';

async function get(url: string, options?: RequestInit) {
    return fetch(url, { method: 'GET', ...options });
}

async function post<T>(url: string, payload?: BodyInit, options?: RequestInit): Promise<T> {
    return fetch<T>(url, { method: 'POST', ...options }, payload);
}

async function put<T>(url: string, payload?: BodyInit, options?: RequestInit): Promise<T> {
    return fetch<T>(url, { method: 'PUT', ...options }, payload);
}

async function patch<T>(url: string, payload?: BodyInit, options?: RequestInit): Promise<T> {
    return fetch<T>(url, { method: 'PATCH', ...options }, payload);
}

async function del<T>(url: string, payload?: BodyInit, options?: RequestInit): Promise<T> {
    return fetch<T>(url, { method: 'DELETE', ...options }, payload);
}

export { get, post, put, patch, del };
