import { base } from '$server/lib/base';
import { matchPassword, UUID, btoa } from '$server/lib/crypto';
import type { Next, Req, Res } from '$server/http/types';

export async function login(req: Req, res: Res, next: Next) {
    try {
        const { email, password, remember } = req.body;

        const USERS = await base('users/data.json');
        const [user] = USERS.find({ email });
        console.log(user)
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
            email,
            remember,
            ...(remember && { maxAge: 31536000 }),
            ip,
            ua,
            create: Date().toLocaleString(),
            exp: remember ? new Date(31536000 * 1000 + Date.now()).toString() : 'Session',
        };
        const client = {
            userid: session.userid,
            email: session.email,
            role: session.role,
            exp: session.exp,
            ...(remember && { maxAge: 31536000 }),
        };

        const SESSIONS = await base('sessions/data.json');
        await SESSIONS.update({ email }, session);

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
