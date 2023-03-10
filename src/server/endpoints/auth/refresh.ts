import jwt from 'jsonwebtoken';
// import cookie from "cookie";
import DB from '$server/lib/db';
import { hashPassword } from '$server/lib/crypto';

export async function refresh(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if (verified) {
            const USERS = await DB.connect('users');
            const user = USERS.id(verified.userid);

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
    } catch (err) {
        console.log('refreshERR: ', err);
        res.error(401, err);
    }
}
