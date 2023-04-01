import { build, context } from 'esbuild';
import svelte from 'esbuild-svelte';
import preprocess from 'svelte-preprocess';
import rm from './env/rm.js';
import log from './env/log.js';
import meta from './env/meta.js';
import copy from './env/copy.js';
import eslint from './env/eslint.js';
import nodemon from './env/nodemon.js';

const DEV = process.argv.includes('--dev');

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
    target: "esnext",
    format: 'esm',
    treeShaking: true,
    entryPoints: ['src/server/app.ts'],
    outfile: 'app/app.mjs',
    legalComments: 'none',
    metafile: !DEV,
    plugins: [eslint()],
    define: {
        'process.env.NODE_ENV': DEV ? '"dev"' : '"prod"'
    }
};

const clientOptions = {
    bundle: true,
    minify: !DEV,
    sourcemap: DEV,
    entryPoints: ['src/client/app.ts'],
    outdir: 'app/client/build',
    loader: { '.svg': 'file' },
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
        log
    ],
    inject: DEV ? ['./env/lr.js'] : []
};

await rm(['app']);

if (DEV) {
    const client = await context(clientOptions);
    const server = await context(serverOptions);

    await client.watch();
    await client.rebuild();

    await server.watch();
    await server.rebuild();

    nodemon('app/app.mjs');

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
