import { app } from './app.js'
import { livereload } from '$server/middlewares/livereload.js';

app.use(livereload);
