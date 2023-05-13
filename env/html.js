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
        ...opts
    };
    return {
        name: 'html',
        setup(build) {
            build.onEnd(async (result) => {
                let html = await readFile(options.in, { encoding: 'utf8' });
                let sprite = await readFile(options.sprite, { encoding: 'utf8' });

                const used = options.icons.join('"|');
                const unused = new RegExp(`(<symbol id="(?!${used}")(.|\n)*?symbol>)`, 'g');
                sprite = sprite.replace(unused, '').replace(/>\s+</g, '><');

                const [js, css] = result.outputFiles;

                html = html
                    .replace('</head>', () => `<script type="module">\n${js.text}</script>\n</head>`)
                    .replace('</head>', () => `<style>\n${css.text}</style>\n</head>`)
                    .replace('<body>', () => `<body>\n${sprite}\n`)
                    .replace(/>\s+</g, '><');

                await writeFile(options.out, `${JSON.stringify(html)}`);
            });
        },
    };
}