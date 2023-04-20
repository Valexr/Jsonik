import { writable } from "svelte/store";

export function getable<T>(init: T) {
    const { subscribe, set } = writable(init);
    return {
        subscribe,
        get: () => init,
        set: (value: T) => set(init = value),
        update: (fn: (state: T) => any) => set(init = fn(init))
    }
}