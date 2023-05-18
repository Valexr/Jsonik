import { app } from '$server/app'
import { proxy } from '$server/middlewares/proxy';

app.use(proxy)