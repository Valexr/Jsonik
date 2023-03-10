import { watch } from 'fs';
import { livereload } from './livereload';

export function startWatch(dir = 'public') {
    const watcher = watch(dir, { recursive: true }, livereload);
    const close = () => watcher.close();
    process.on('SIGTERM', close);
    process.on('exit', close);
}