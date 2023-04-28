import { base } from '$server/lib/db.js';
import { atob } from '$server/lib/crypto.js';
import type { Next, Req, Res } from '$server/http/types.js';

export async function cookie(req: Req, res: Res, next: Next) {
    if (req.cookie) {
        try {
            const ip = req.socket.remoteAddress;
            const ua = req.headers['user-agent'];

            if (req.cookie.sid) {
                const SESSIONS = await base('sessions/data.json');
                const session = SESSIONS?.id(atob(req.cookie.sid as string))

                if (session.id) {
                    const verified = ip?.localeCompare(session.ip) === 0 && ua?.normalize() === session.ua.normalize();
                    const user = { userid: session.userid, username: session.username, role: session.role };
                    console.log('cookie: ', req.cookie, session, user, verified);
                    req.url.includes('cookie') ? res.send(user) : verified ? next() : res.error(400, 'cookie invalid');
                }
            } else next();
        } catch (err) {
            console.log('cookieERR: ', err);
            res.cookie({ sid: '', maxAge: 0, path: '/' })
            res.error(400, 'cookie invalid');
        }
    } else if (req.headers.authorization) {
        next();
    } else {
        res.cookie({ sid: '', maxAge: 0, path: '/' })
        res.error(400, 'cookie not provided');
    }
}
