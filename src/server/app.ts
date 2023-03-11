import { derver } from '$server/derver';
import { data } from '$server/endpoints/data';
import { files } from '$server/endpoints/files';
import { log } from '$server/middlewares/log';
// import { auth } from '$server/endpoints/auth';
// import { cookies } from '$server/endpoints/auth/cookies';
// import { token } from '$server/endpoints/auth/token';
import type { App, Options } from '$server/derver/types';

const DEV = process.env.NODE_ENV === 'dev';

const options: Partial<Options> = {
    host: '0.0.0.0',
    port: DEV ? 8080 : 8888,
    cache: DEV ? 0 : 3600,
    compress: !DEV,
    livereload: DEV,
    serve: 'client',
    spa: true,
}

export const app = derver(options)

app.sub('/api', (app: App) => {
    app.sub('/v1', (app: App) => {
        app.use(log);
        // app.sub('/auth', auth);
        // app.use(cookies);
        // app.use(token);
        app.sub('/data', data);
        app.sub('/files', files);
    });
});
