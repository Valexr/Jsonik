import { files } from './files.js';
import { schemas } from './schemas.js';
import { records } from './records.js';
import { connect } from '$server/middlewares/connect.js';

import type { App } from '$server/derver/types.js';

export function data(app: App) {
    app.sub('/files/:file?', files);
    app.use('/:file?/:table?', connect);
    app.sub('/:file?/schemas', schemas);
    app.sub('/:file?/records', records);
}
