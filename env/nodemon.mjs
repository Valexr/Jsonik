import { watch } from 'fs';
import { join, dirname } from "path";
import { fork } from "child_process";

const CWD = process.cwd();

export default function nodemon(path) {
    let child;

    const kill = () => {
        child && child.kill();
    };

    const start = () => {
        child = fork(join(CWD, path), { cwd: join(CWD, dirname(path)) });
    };

    process.on('SIGTERM', kill);
    process.on('exit', kill);

    watch(path, () => {
        kill();
        start();
    });
}