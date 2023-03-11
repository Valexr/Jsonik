import { fork } from "child_process";

export default {
    name: 'restart',
    setup(build) {
        let child = null;
        build.onEnd(result => {

            const kill = () => {
                child && child.kill();
            };

            const start = () => {
                child = fork('app.js', [], { cwd: 'app' });
            };

            process.on('SIGTERM', kill);
            process.on('exit', kill);

            kill();
            start();
        });
    }
};