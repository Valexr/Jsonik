import { base } from '$server/lib/db.js';
import { btoa } from '$server/lib/crypto.js';
import { matchPassword, UUID } from '$server/lib/crypto.js';
import type { Next, Req, Res } from '$server/http/types.js';

export async function login(req: Req, res: Res, next: Next) {
    try {
        const { username, password, remember } = req.body;

        const USERS = await base('users/data.json');
        const user = USERS?.find({ username });
        if (!user) res.error(400, 'User not found');

        const pass = matchPassword(password, user.password);
        if (!pass) res.error(401, 'Bad password');

        const ip = req.socket.remoteAddress;
        const ua = req.headers['user-agent'];
        const sessionid = UUID();
        const session = {
            id: sessionid,
            userid: user.id,
            role: user.role,
            username,
            remember,
            ...(remember && { maxAge: 31536000 }),
            ip,
            ua,
            create: Date().toLocaleString(),
            exp: remember ? new Date(31536000 * 1000 + Date.now()).toString() : 'Session',
        };
        const client = {
            userid: session.userid,
            username: session.username,
            role: session.role,
            exp: session.exp,
            ...(remember && { maxAge: 31536000 }),
        };

        const SESSIONS = await base('sessions/data.json');
        await SESSIONS?.replace({ username }, session);

        res.cookie({
            sid: btoa(sessionid),
            ...(remember && { 'Max-Age': 31536000 }),
            Path: '/',
            HttpOnly: true,
            SameSite: 'lax',
        })
        res.send(client);
    } catch (err: any & Error) {
        console.log('loginERR: ', err);
        res.error(401, err);
    }
}
