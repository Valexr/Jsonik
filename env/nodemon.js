import { join, dirname } from "node:path";
import { fork } from "node:child_process";

const CWD = process.cwd();

export default function (path) {
    let child;
    return {
        name: 'nodemon',
        setup(build) {
            build.onEnd(result => {
                if (child) child.kill();
                child = fork(join(CWD, path), [], { cwd: join(CWD, dirname(path)) });
            });
        },
    };
};