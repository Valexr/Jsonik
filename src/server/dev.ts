import { app } from '$server/app'
import { livereload } from '$server/middlewares/livereload';

app.use(livereload)