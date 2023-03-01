function deferred<T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;

    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return { promise, resolve, reject };
};

function switchTimeout(value: any, tm = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value);
        }, tm);
    });
}

function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function decimal(value: number, digit = 4) {
    return parseFloat(value.toFixed(digit));
}

function s(count: number) {
    return count > 1 ? "s" : "";
}

export { deferred, switchTimeout, decimal, delay, s }