import { cp } from 'fs/promises';

export default function copy(paths = []) {
    return {
        name: 'copy',
        setup(build) {
            build.onEnd(async (end) => {
                for (const [from, to] of paths) {
                    await cp(from, to, {
                        recursive: true,
                        force: true,
                        dereference: true,
                    });
                };
            });
        },
    };
}
