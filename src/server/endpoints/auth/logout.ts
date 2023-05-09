import { base } from '$server/lib/base';
import { atob } from '$server/lib/crypto';
import type { Next, Req, Res } from '$server/http/types';

export async function logout(req: Req, res: Res, next: Next) {
    if (req.cookie)
        try {
            const SESSIONS = await base('sessions/data.json');
            const [session] = SESSIONS.find({ id: atob(req.cookie.sid as string) });
            const message = session.maxAge ? { username: session.username } : {};

            res.cookie({ sid: '', 'max-age': 0, path: '/' });
            res.end(JSON.stringify(message));
        } catch (err: any & Error) {
            console.log('logoutERR: ', err);
            res.error(401, err);
        }
    else {
        res.cookie({ sid: '', 'max-age': 0, path: '/' });
        res.error(400, 'cookie not provided');
    }
}
