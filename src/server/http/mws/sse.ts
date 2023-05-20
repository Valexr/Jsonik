import type { Next, Req, Res } from "../types";

type Listener = (event: string, message: string | Body) => boolean

const listeners = new Set<Listener>();

function emit(event: string, message: string | Body) {
    // console.log(listeners.size)
    listeners.forEach(listener => listener(event, message));
}

export function stream(req: Req, res: Res, next: Next) {
    if (req.url === '/stream') {
        const listener = (event: string, message: string | Body) => {
            return res.write(`event: ${event}\ndata: ${message}\n\n`)
        }

        listeners.add(listener);

        res.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });
        res.write('data: connected\n\n')
        req.on('close', () => listeners.delete(listener));

    } else next()
}

export function sse(req: Req, res: Res, next: Next) {
    res.sse = (event = '', message: string | Body) => {
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }
        emit(event, message)
        // return res.write(`event: ${event}\ndata: ${message}\n\n`)
    };
    next()
}