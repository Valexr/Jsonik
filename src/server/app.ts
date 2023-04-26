import { server } from '$server/http/index.js';
import { data } from '$server/endpoints/data/index.js';
import { files } from '$server/endpoints/files.js';
import { logs } from '$server/endpoints/logs.js';
import { log } from '$server/middlewares/log.js';
// import { auth } from '$server/endpoints/auth/index.js';
// import { cookies } from '$server/endpoints/auth/cookies';
// import { token } from '$server/endpoints/auth/token.js';
import type { App, Options } from '$server/http/types.js';
import { HttpBadRequest, HttpNotFound, HttpInternalServer, HttpResponseCodes } from './lib/errors.js';

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

app.sub('/api/v1', (app: App) => {
    app.use(log);
    // app.sub('/auth', auth);
    // app.use(cookies);
    // app.use(token);
    app.sub('/data', data);
    app.sub('/files', files);
    app.sub('/logs', logs);
});
