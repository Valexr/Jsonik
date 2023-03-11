import { build, context } from 'esbuild';
import svelte from 'esbuild-svelte';
import preprocess from 'svelte-preprocess';
import rm from './env/rm.mjs';
import log from './env/log.mjs';
import meta from './env/meta.mjs';
import copy from './env/copy.mjs';
import eslint from './env/eslint.mjs';
import nodemon from './env/nodemon.mjs';

const DEV = process.env.NODE_ENV === 'dev';

const svelteOptions = {
    compileOptions: {
        dev: DEV,
        css: false,
        immutable: true
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
    sourcemap: DEV,
    platform: 'node',
    format: 'esm',
    treeShaking: true,
    entryPoints: ['src/server/app.ts'],
    outdir: 'app',
    legalComments: 'none',
    metafile: !DEV,
    plugins: [],
};

const clientOptions = {
    bundle: true,
    minify: !DEV,
    sourcemap: DEV,
    entryPoints: ['src/client/app.ts'],
    outdir: 'app/client/build',
    loader: { '.svg': 'text' },
    legalComments: "none",
    metafile: !DEV,
    mainFields: ['svelte', 'module', 'main'],
    target: "esnext",
    plugins: [
        svelte(svelteOptions),
        copy([
            ['src/client/app.html', 'app/client/index.html'],
            ['src/client/assets', 'app/client'],
        ]),
        log
    ],
    inject: DEV ? ['./env/lr.mjs'] : []
};



await rm(['app']);

if (DEV) {
    const client = await context(clientOptions);
    const server = await context(serverOptions);

    await client.watch();
    await client.rebuild();

    await server.watch();
    await server.rebuild();

    nodemon('app/app.js');

    const cleanup = () => {
        client.dispose();
        server.dispose();
    };

    process.on('SIGTERM', cleanup);
    process.on("exit", cleanup);

} else {
    const server = await build(serverOptions);
    const client = await build(clientOptions);
    await meta(server, 'server');
    await meta(client, 'client');
}
