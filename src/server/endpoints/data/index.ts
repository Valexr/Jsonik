import { files } from './files';
import { schemas } from './schemas';
import { records } from './records';
import { connect } from '$server/middlewares/connect';

import type { App } from '$server/http/types';

export function data(app: App) {
    app.use('/:file?/:table', connect);
    app.sub('/:file/schemas', schemas);
    app.sub('/:file/records', records);
    app.sub('/:file?', files);
}
