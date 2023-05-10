import { server } from '$server/http/index';
import { data } from '$server/endpoints/data/index';
import { files } from '$server/endpoints/files';
import { logs } from '$server/endpoints/logs';
import { log } from '$server/middlewares/log';
import { auth } from '$server/endpoints/auth/index';
// import { cookie } from '$server/endpoints/auth/cookie';
import { token } from '$server/endpoints/auth/token';
import type { App, Options } from '$server/http/types';
// import { HttpBadRequest, HttpNotFound, HttpInternalServer, HttpResponseCodes } from '$server/lib/errors';

const DEV = process.env.NODE_ENV === 'dev';

const options: Partial<Options> = {
    host: '0.0.0.0',
    port: DEV ? 8080 : 8888,
    cache: DEV ? 0 : 3600,
    compress: !DEV,
    serve: 'client',
    spa: true,
}

export const app = server(options)

app.sub('/api', (app: App) => {
    app.use(log);
    app.sub('/auth', auth);
    // app.use(cookie);
    // app.use(token);
    app.sub('/data', data);
    app.sub('/files', files);
    app.sub('/logs', logs);
});
