import os from 'os';
import { cookies } from '$server/endpoints/auth/cookies';
import { token } from '$server/endpoints/auth/token';
import { login } from '$server/endpoints/auth/login';
import { logout } from '$server/endpoints/auth/logout';
import { refresh } from '$server/endpoints/auth/refresh';
import type { App } from '$server/derver/types';

console.log('mac: ', os.networkInterfaces())

export function auth(app: App) {
    app.get('/cookie', cookies);
    app.get('/token', token);
    app.post('/login', login);
    app.post('/logout', logout);
    app.get('/refresh', refresh);
}
