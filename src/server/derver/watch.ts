import { watch } from 'fs';
import { livereload } from './livereload.js';

export function clientWatch(dir = 'public') {
    const watcher = watch(dir, { recursive: true }, livereload);

    process.on('SIGTERM', () => watcher.close());
    process.on('exit', () => watcher.close());
}
