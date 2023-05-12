import { build, context } from 'esbuild';
import svelte from 'esbuild-svelte';
import preprocess from 'svelte-preprocess';
import rm from './env/rm.js';
import meta from './env/meta.js';
import copy from './env/copy.js';
import eslint from './env/eslint.js';
import nodemon from './env/nodemon.js';
import change from './env/change.js';
import html from './env/html.js';

const DEV = process.argv.includes('--dev');

const svelteOptions = {
    compilerOptions: {
        dev: DEV,
    },
    preprocess: [
        preprocess({
            sourceMap: DEV,
            typescript: true,
        }),
    ]
};

const options = {
    bundle: true,
    minify: !DEV,
    sourcemap: DEV && 'inline',
    target: "esnext",
    format: 'esm',
    legalComments: 'none',
    metafile: !DEV,
    logLevel: 'info',
};

const serverOptions = {
    ...options,
    platform: 'node',
    entryPoints: ['src/server/app.ts'],
    outfile: 'app/app.mjs',
    plugins: [
        // eslint(),
        ...(DEV ? [nodemon('app/app.mjs')] : [])
    ],
    define: {
        'process.env.NODE_ENV': DEV ? '"dev"' : '"prod"'
    },
};

const clientOptions = {
    ...options,
    entryPoints: ['src/client/app.ts'],
    outdir: 'app/client/build',
    inject: DEV ? ['./env/lr.js'] : [],
    write: false,
    plugins: [
        svelte(svelteOptions),
        html()
    ],
};

await rm(['app/app.mjs']);

if (DEV) {
    const client = await context(clientOptions);
    const server = await context(serverOptions);

    await client.watch();
    await server.watch();

    await server.serve({ servedir: 'app' });

    function cleanup() {
        client.dispose();
        server.dispose();
    }

    process.on('SIGTERM', cleanup);
    process.on("exit", cleanup);

} else {
    const client = await build(clientOptions);
    const server = await build(serverOptions);

    await meta(client, 'client');
    await meta(server, 'server');
}
