function parse(str: string): Record<string, string | number | boolean> {
    const entries = str.split(/;\s?/).map(v => decodeURIComponent(v).split(/=(.+)/))
    return Object.fromEntries(entries)
}

function stringify(cookies: Record<string, string | number | boolean>) {
    return Object.entries(cookies)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('; ');
}

export const cookies = { parse, stringify }