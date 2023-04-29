import { getable } from './getable';
import { del, get, post, put, patch } from "$client/api/methods";
import { uniq } from '$client/utils';

export type Creds = {
    email: string
    password: string
    remember: boolean
}

export type User = Record<string, string>

function createAuth() {
    const { set, subscribe, update } = getable<User>({})
    return {
        update,
        subscribe,
        async login(creds: Creds) {
            const user = await post<User>(`/auth/login`, JSON.stringify(creds), {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            set(user)
        },
    }
}
export const auth = createAuth()