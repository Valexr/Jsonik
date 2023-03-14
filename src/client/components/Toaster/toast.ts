import { writable } from 'svelte/store';

import type { Pos } from './positions.js';

interface ToastItem {
    id?: number;
    type?: string;
    title?: string;
    msg?: string;
    icon?: string;
    closable?: boolean;
    timeout?: number;
    invert?: boolean;
    reverse?: boolean;
    pos?: Pos;
}

export type { Pos, ToastItem };

const defaults: ToastItem = { closable: true, pos: 'top_center' };

function createToast() {
    const { subscribe, set, update } = writable([]);

    let id = 0;

    const send = (toast: ToastItem = {}) => {
        toast.id = id++;
        update((state) => [...state, { ...defaults, ...toast }] as never);
    };
    const close = (id: number) => {
        update((state) => [...state.filter((t: ToastItem) => t.id !== id)]);
    };
    const clear = () => set([]);

    return {
        subscribe,
        send,
        close,
        clear,
        default: (toast: ToastItem = {}) =>
            send({ msg: 'default', icon: 'message', ...toast }),
        error: (toast: ToastItem = {}) =>
            send({ type: 'error', icon: 'stop', ...toast }),
        warning: (toast: ToastItem = {}) =>
            send({ type: 'warning', icon: 'mail', ...toast }),
        primary: (toast: ToastItem = {}) =>
            send({ type: 'primary', icon: 'flag', ...toast }),
        success: (toast: ToastItem = {}) =>
            send({ type: 'success', icon: 'check', ...toast }),
    };
}

export const toast = createToast();
