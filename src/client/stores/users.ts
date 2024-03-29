import { getable } from './getable';
import { del, get, post, put, patch } from "$client/api/methods";
import { uniq } from '$client/utils';

function createRoles() {
    const { set, subscribe, update } = getable({})
    return {
        update,
        subscribe,
        async login(creds: object) {
            const user = await post<object>(`/auth/login`, JSON.stringify(creds), {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            set(user)
        },
    }
}
export const roles = createRoles()