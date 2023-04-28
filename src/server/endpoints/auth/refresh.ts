import { jwt } from '$server/lib/jwt.js';
import { base } from '$server/lib/db.js';
import { hashPassword } from '$server/lib/crypto.js';
import type { Next, Req, Res } from '$server/http/types.js';

export async function refresh(req: Req, res: Res, next: Next) {
    if (req.token) {
        try {
            const token = req.token;
            const verified = jwt.verify(token, process.env.JWT_SECRET);

            if (verified) {
                const USERS = await base('users/data.json');
                const user = USERS?.id(verified.userid);

                // req.cookies = cookie.parse(req.headers.cookie || '');
                // const access = req.cookies.sid
                // const acc = jwt.verify(access, 'secret');

                const access = jwt.sign({ userid: user.id, pass: hashPassword(user.password) }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_ACCESS_EXP,
                });
                res.send({ access, userid: user.id, username: user.username, refreshexp: verified.exp });
                // console.log(user, verified)
            } else {
                console.log('Token filed');
                res.error(401, 'Token filed');
            }
        } catch (err: any & Error) {
            console.log('refreshERR: ', err);
            res.error(401, err);
        }
    }
}
