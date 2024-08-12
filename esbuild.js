import { build, context } from 'esbuild';
import svelte from 'esbuild-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import rm from './env/rm.js';
import meta from './env/meta.js';
import eslint from './env/eslint.js';
import nodemon from './env/nodemon.js';
import html from './env/html.js';

const DEV = process.argv.includes('--dev');
const APP = 'app/app.cjs';

const svelteOptions = {
    compilerOptions: { dev: DEV },
    preprocess: sveltePreprocess()
};

const options = {
    bundle: true,
    minify: !DEV,
    // sourcemap: DEV && 'inline',
    legalComments: 'none',
    metafile: !DEV,
    logLevel: 'info',
};

const clientOptions = {
    ...options,
    entryPoints: ['src/client/app.ts'],
    outdir: 'app/client/build',
    inject: DEV ? ['./env/reload.js'] : [],
    write: false,
    plugins: [svelte(svelteOptions), html()],
    loader: {
        '.ico': 'dataurl',
        '.png': 'dataurl'
    },
    conditions: ['svelte']
};

const serverOptions = {
    ...options,
    platform: 'node',
    entryPoints: ['src/server/app.ts'],
    outfile: APP,
    plugins: DEV ? [nodemon(APP)] : [],
    define: {
        'process.env.NODE_ENV': DEV ? '"dev"' : '"prod"'
    },
};

await rm([APP]);

if (DEV) {
    const client = await context(clientOptions);
    const server = await context(serverOptions);

    await client.watch();
    await server.watch();

    async function cleanup() {
        await client.dispose();
        await server.dispose();
    }

    process.on('SIGTERM', cleanup);
    process.on("exit", cleanup);

} else {
    const client = await build(clientOptions);
    const server = await build(serverOptions);

    await meta(client, 'client');
    await meta(server, 'server');
}
