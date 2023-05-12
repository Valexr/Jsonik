import { readFile, writeFile, mkdir } from 'fs/promises';

const icons = [
    "database",
    "hard-drive",
    "users",
    "clock",
    "settings",
    "power",
    "trash",
    "x",
    "plus-square",
    "edit",
    "calendar",
    "arrow-down",
    "type",
    "hash",
    "at-sign",
    "link",
    "phone",
    "save",
    "plus",
    "check-square",
    "list",
    "image",
    "code",
    "file-text",
    "file-plus",
    "folder-plus",
    "user-plus",
    "arrow-left",
    "arrow-right"
];

export default function html(opts) {
    const options = {
        in: './src/client/assets/app.html',
        out: './src/server/http/client.json',
        sprite: './src/client/assets/sprite.svg',
        icons,
        dev: false,
        ...opts
    };
    return {
        name: 'html',
        setup(build) {
            build.onEnd(async (result) => {
                let html = await readFile(options.in, { encoding: 'utf8' });
                let sprite = await readFile(options.sprite, { encoding: 'utf8' });

                const matched = sprite.match(/(<symbol(.|\n)*?<\/symbol>\n?)/g)
                    .filter(m => !options.icons.some(i => m.includes(`id="${i}"`)));
                matched.forEach(m => {
                    sprite = sprite.replace(`${m}`, '');
                });
                if (options.dev) {
                    const linkedReplace = `\t<link rel='stylesheet' href='/build/app.css'>\n\t\t<script defer type="module" src='/build/app.js'></script>\n\t</head>`;
                    html = html.replace('</head>', linkedReplace);
                } else {
                    const [js, css] = result.outputFiles;

                    html = html
                        .replace('</head>', () => `<script type="module">\n${js.text}</script>\n</head>`)
                        .replace('</head>', () => `<style>\n${css.text}</style>\n</head>`)
                        .replace('<body>', () => `<body>\n${sprite.replace(/>\s+</g, '><')}\n`)
                        .replace(/>\s+</g, '><');
                    // .replace('</body>', () => `<script type="module">\n${js.text}</script>\n</body>`);
                }

                await writeFile(options.out, `${JSON.stringify(html)}`, { encoding: 'utf8' });
            });
        },
    };
}