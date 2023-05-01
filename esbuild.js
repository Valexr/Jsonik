import { build, context } from 'esbuild';
import svelte from 'esbuild-svelte';
import preprocess from 'svelte-preprocess';
import rm from './env/rm.js';
import log from './env/log.js';
import meta from './env/meta.js';
import copy from './env/copy.js';
import eslint from './env/eslint.js';
import nodemon from './env/nodemon.js';
import change from './env/change.js';

const DEV = process.argv.includes('--dev');

const svelteOptions = {
    compilerOptions: {
        dev: DEV
    },
    preprocess: [
        preprocess({
            sourceMap: DEV,
            typescript: true,
        }),
    ]
};

const serverOptions = {
    bundle: true,
    minify: !DEV,
    sourcemap: DEV && 'inline',
    platform: 'node',
    target: "esnext",
    format: 'esm',
    treeShaking: true,
    entryPoints: [DEV ? 'src/server/dev.ts' : 'src/server/app.ts'],
    outfile: 'app/app.mjs',
    legalComments: 'none',
    metafile: !DEV,
    plugins: [
        // eslint(),
        ...(DEV ? [nodemon('app/app.mjs')] : [])
    ],
    define: {
        'process.env.NODE_ENV': DEV ? '"dev"' : '"prod"'
    },
    logLevel: 'info',
};

const clientOptions = {
    bundle: true,
    minify: !DEV,
    sourcemap: DEV && 'inline',
    entryPoints: ['src/client/app.ts'],
    outdir: 'app/client/build',
    // loader: { '.svg': 'file' },
    legalComments: "none",
    metafile: !DEV,
    mainFields: ['svelte', 'module', 'main'],
    target: "esnext",
    format: 'esm',
    plugins: [
        svelte(svelteOptions),
        copy([
            ['src/client/app.html', 'app/client/index.html'],
            ['src/client/assets', 'app/client'],
        ]),
        ...(DEV ? [change] : [])
    ],
    inject: DEV ? ['./env/lr.js'] : [],
    logLevel: 'info'
};

await rm(['app/client', 'app/app.mjs']);

if (DEV) {
    const client = await context(clientOptions);
    const server = await context(serverOptions);

    await client.watch();
    await client.rebuild();

    await server.watch();
    await server.rebuild();;

    function cleanup() {
        client.dispose();
        server.dispose();
    }

    process.on('SIGTERM', cleanup);
    process.on("exit", cleanup);

} else {
    const server = await build(serverOptions);
    const client = await build(clientOptions);

    await meta(server, 'server');
    await meta(client, 'client');
}
