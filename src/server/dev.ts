import { app } from './app'
import { livereload } from '$server/middlewares/livereload';

app.use(livereload);
