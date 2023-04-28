import os from 'os';
import { cookie } from '$server/endpoints/auth/cookie';
import { token } from '$server/endpoints/auth/token';
import { login } from '$server/endpoints/auth/login';
import { logout } from '$server/endpoints/auth/logout';
import { refresh } from '$server/endpoints/auth/refresh';
import type { App } from '$server/http/types';

console.log('mac: ', os.networkInterfaces())

export function auth(app: App) {
    app.get('/cookie', cookie);
    app.get('/token', token);
    app.post('/login', login);
    app.post('/logout', logout);
    app.get('/refresh', refresh);
}
