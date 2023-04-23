export function pattern(pattern: string, path: string) {
    const keys: Array<string> = [];
    const params: Record<string, string | undefined> = {};

    const rgx = pattern.split('/')
        .map(seg => {
            if (seg.startsWith(':')) {
                const opt = seg.endsWith('?');
                const key = opt ? seg.slice(1, -1) : seg.slice(1)
                keys.push(key)
                // return opt ? '([^/]+?)?' : '([^/]+?)'
                return opt ? '(.*?)' : '(.+)'
            } else return seg
        })
        .join('/')

    let exact = true;
    let match = path.match(new RegExp(`^${rgx}$`));

    if (!match) {
        exact = false;
        match = path.match(new RegExp(`^${rgx}`));
    }
    if (!match) return null;

    keys.forEach((key, i) => params[key] = match?.[i + 1] || '');

    return { exact, params }
}