import { join, dirname } from "node:path";
import { fork } from "node:child_process";

const CWD = process.cwd();

export default function (path) {
    return {
        name: 'nodemon',
        setup(build) {
            let child;
            build.onEnd(() => {
                if (child) child.kill('SIGINT');
                child = fork(join(CWD, path), [], { cwd: join(CWD, dirname(path)) });
            });
        },
    };
};