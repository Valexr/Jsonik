import { readFile, writeFile } from 'fs/promises';

export default function html(opts) {
    const options = {
        in: './src/app.html',
        out: './public/index.html',
        sprite: './src/app.svg',
        icons: [],
        dev: true,
        ...opts
    };
    return {
        name: 'html',
        setup(build) {
            build.onEnd(async (result) => {
                const { icons } = options;
                let html = await readFile(options.in, { encoding: 'utf8' });
                let sprite = await readFile(options.sprite, { encoding: 'utf8' });
                const matched = sprite.match(/(<symbol(.|\n)*?<\/symbol>\n)/g)
                    .filter(m => !icons.some(i => m.includes(`id="${i}"`)));
                matched.forEach(m => {
                    console.log(m);
                    sprite = sprite.replace(`${m}`, '');
                });
                console.log(html);
                if (options.dev) {
                    const linkedReplace = `\t<link rel='stylesheet' href='/build/app.css'>\n\t\t<script defer type="module" src='/build/app.js'></script>\n\t</head>`;
                    html = html.replace('</head>', linkedReplace);
                } else {
                    let [js, css] = result.outputFiles;

                    html = html
                        .replace('</head>', () => `<style>\n${css.text}</style>\n<script type="module">\n${js.text}</script>\n</head>`)
                        .replace('<body>', () => `<body>\n${sprite.replace(/>\s+</g, '><')}\n`);
                    // .replace('</body>', () => `<script type="module">\n${js.text}</script>\n</body>`);
                }

                await writeFile(options.out, html, { encoding: 'utf8' });
            });
        },
    };
}