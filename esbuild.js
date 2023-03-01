import { build, context } from 'esbuild';
import svelte from 'esbuild-svelte';
import preprocess from 'svelte-preprocess';
import rm from './env/rm.js';
import log from './env/log.js';
import meta from './env/meta.js';
import proxy from './env/proxy.js';

const DEV = process.argv.includes('--dev');
const SPA = process.argv.includes('--spa');

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

const buildOptions = {
    bundle: true,
    minify: !DEV,
    sourcemap: DEV,
    entryPoints: ['src/app.ts'],
    outdir: 'public/build',
    format: 'esm',
    loader: { '.svg': 'text' },
    plugins: [svelte(svelteOptions), log],
    inject: DEV ? ['./env/lr.js'] : [],
    legalComments: "none",
    metafile: !DEV
};

await rm('public/build');

if (DEV) {
    const ctx = await context(buildOptions);

    await ctx.watch();
    await ctx.serve({ servedir: 'public' });

    SPA && proxy().listen(8080);

    process.on('SIGTERM', ctx.dispose);
    process.on("exit", ctx.dispose);

} else {
    await meta(await build(buildOptions));
}