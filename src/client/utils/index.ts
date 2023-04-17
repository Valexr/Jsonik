function deferred<T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;

    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return { promise, resolve, reject };
}

function switchTimeout(value: any, ms = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value);
        }, ms);
    });
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function decimal(value: number, digit = 4) {
    return parseFloat(value.toFixed(digit));
}

function s(count?: number) {
    return count && count > 1 ? "s" : "";
}

function listen(
    node: EventTarget,
    event: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | EventListenerOptions
): () => void {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}

function uniq(array?: any[]) {
    return Array.from(new Set(array))
}

function typed(o: Record<string, any>) {
    return Object.entries(o).reduce<Record<string, any>>((a, [k, v]) => {
        a[k] =
            (v && Number(v)) || ["true", "false"].includes(v)
                ? Boolean(v)
                : v;
        return a;
    }, {});
}

export { deferred, switchTimeout, decimal, delay, s, listen, uniq }


function removeFileFromFileList(fileList: FileList, name: string) {
    const DT = new DataTransfer();
    if (fileList) {
        for (const file of fileList) {
            if (name !== file.name) DT.items.add(file);
        }
    }
    return DT.files;
}