import type { Next, Req, Res } from './types';

type Listener = (event: string) => boolean

const listeners = new Set<Listener>();

export function livereload(event: string) {
    listeners.forEach(listener => listener(event));
}

export function mwLivereload() {
    return function (req: Req, res: Res, next: Next) {
        if (req.url === '/livereload') {
            const listener = (event: string) => {
                return res.write(`event: ${event}\ndata: ${event}ed\n\n`)
            }

            listeners.add(listener);

            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            });

            res.on('close', () => listeners.delete(listener));

            res.write('data: connected\n\n')
        } else next();
    }
}
