export interface Timer {
    set: (remaining: number) => void;
    pause: () => void;
    resume: () => void;
    clear: () => void;
}

export function Timer(callback: () => void, delay: number): Timer {
    let timerId: NodeJS.Timeout,
        start: number,
        remaining: number = delay;

    const set = (remaining: number) => {
        clearTimeout(timerId);
        timerId = setTimeout(callback, remaining);
    };

    const pause = () => {
        clearTimeout(timerId);
        remaining -= Date.now() - start;
    };

    const resume = () => {
        start = Date.now();
        clearTimeout(timerId);
        timerId = setTimeout(callback, remaining);
    };

    const clear = () => {
        clearTimeout(timerId);
    };

    resume();

    return { set, pause, resume, clear };
}
