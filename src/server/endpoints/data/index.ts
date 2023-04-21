import { files } from './files.js';
import { schemas } from './schemas.js';
import { records } from './records.js';
import { collect } from './collect.js';
import { connect } from '$server/middlewares/connect.js';

import type { App } from '$server/http/types.js';

export function data(app: App) {
    app.use('/:file/:table', connect);
    app.sub('/:file/schemas', schemas);
    app.sub('/:file/records', records);
    // app.sub('/:file/', collect);
    app.sub('/:file?', files);
}
