import os from 'os';
import { cookies } from '$server/endpoints/auth/cookies.js';
import { token } from '$server/endpoints/auth/token.js';
import { login } from '$server/endpoints/auth/login.js';
import { logout } from '$server/endpoints/auth/logout.js';
import { refresh } from '$server/endpoints/auth/refresh.js';
import type { App } from '$server/http/types.js';

console.log('mac: ', os.networkInterfaces())

export function auth(app: App) {
    app.get('/cookie', cookies);
    app.get('/token', token);
    app.post('/login', login);
    app.post('/logout', logout);
    app.get('/refresh', refresh);
}
