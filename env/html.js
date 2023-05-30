import { readFile, writeFile } from 'fs/promises';

const icons = [
    "alert-triangle",
    "arrow-down",
    "arrow-left",
    "arrow-right",
    "arrow-up",
    "at-sign",
    "calendar",
    "check-square",
    "clock",
    "code",
    "database",
    "edit",
    "file-plus",
    "file-text",
    "folder-plus",
    "hard-drive",
    "hash",
    "image",
    "key",
    "link",
    "list",
    "move",
    "phone",
    "plus",
    "plus-square",
    "power",
    "save",
    "settings",
    "trash",
    "type",
    "user-plus",
    "users",
    "x"
];

export default function html(opts) {
    const options = {
        in: './src/client/assets/app.html',
        out: './src/server/http/mws/client.json',
        sprite: './src/client/assets/sprite.svg',
        icons,
        ...opts
    };
    return {
        name: 'html',
        setup(build) {
            build.onEnd(async (result) => {
                const html = await readFile(options.in, { encoding: 'utf8' });
                const sprite = await readFile(options.sprite, { encoding: 'utf8' });

                const used = options.icons.join('"|');
                const unused = new RegExp(`(<symbol id="(?!${used}")(.|\n)*?symbol>)`, 'g');
                const icons = sprite.replace(unused, '');

                const [js, css] = result.outputFiles;

                function replacer(k, v) {
                    return v.replace('</body>', () => `<script>\n${js.text}</script>\n</body>`)
                        .replace('</head>', () => `<style>\n${css.text}</style>\n</head>`)
                        .replace('<body>', () => `<body>\n${icons}\n`)
                        .replace(/>\s+</g, '><');
                }

                await writeFile(options.out, JSON.stringify(html, replacer));
            });
        },
    };
}