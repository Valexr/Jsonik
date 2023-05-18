import { server } from '$server/http/index';
import { log } from '$server/middlewares/log';
import { auth } from '$server/endpoints/auth/index';
import { cookie } from '$server/endpoints/auth/cookie';
import { token } from '$server/endpoints/auth/token';
import { data } from '$server/endpoints/data/index';
import { files } from '$server/endpoints/files';
import { logs } from '$server/endpoints/logs';
import type { App } from '$server/http/types';

const DEV = process.env.NODE_ENV === 'dev';
const PORT = process.env.PORT || 8080
const CACHE = process.env.CACHE || 0

export const app = server({
    host: '0.0.0.0',
    port: Number(PORT),
    cache: Number(CACHE),
    compress: !DEV
})

app.sub('/api', (app: App) => {
    app.use(log);
    app.sub('/auth', auth);
    // app.use(cookie);
    // app.use(token);
    app.sub('/data', data);
    app.sub('/files', files);
    app.sub('/logs', logs);
});
