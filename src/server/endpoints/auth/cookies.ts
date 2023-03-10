import cookie from 'cookie';
import DB from '$server/lib/db';
import { atob } from '$server/lib/utils';
import type { Next, Req, Res } from '$server/derver/types';

export async function cookies(req: Req, res: Res, next: Next) {
    // console.log(crypto.randomUUID(), crypto.scrypt('password', 'salt', 64, (err, derivedKey) => {
    //     if (err) throw err;
    //     console.log(derivedKey.toString('hex'));
    // }))
    if (req.headers.cookie) {
        try {
            const cookies = cookie.parse(req.headers.cookie);
            const ip = req.socket.remoteAddress;
            const ua = req.headers['user-agent'];

            if (cookies.sid) {
                const SESSIONS = await DB.connect('sessions', 'items');
                const session = SESSIONS?.id(atob(cookies.sid))

                if (session.id) {
                    const verified = ip?.localeCompare(session.ip) === 0 && ua?.normalize() === session.ua.normalize();
                    const user = { userid: session.userid, username: session.username, role: session.role };
                    console.log('cookie: ', cookies, session, user, verified);
                    req.url.includes('cookie') ? res.send(user) : verified ? next() : res.error(400, 'cookie invalid');
                }
            } else next();
        } catch (err) {
            console.log('cookieERR: ', err);
            res.error(400, 'cookie invalid', {
                'Set-Cookie': cookie.serialize('sid', '', { maxAge: 0, path: '/' }),
            });
        }
    } else if (req.headers.authorization) {
        next();
    } else {
        res.error(400, 'cookie not provided', {
            'Set-Cookie': cookie.serialize('sid', '', { maxAge: 0, path: '/' }),
        });
    }
}
