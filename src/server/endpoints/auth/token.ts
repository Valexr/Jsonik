import jwt, { type GetPublicKeyOrSecret, type Secret } from 'jsonwebtoken';
import type { Next, Req, Res } from '$server/http/types.js';

export function token(req: Req, res: Res, next: Next) {
    if (req.token) {
        try {
            const token = req.token;
            const verified = jwt.verify(token, process.env.JWT_SECRET as Secret | GetPublicKeyOrSecret);
            console.log('token: ', verified);
            next();
        } catch (err: any & Error) {
            switch (err.message) {
                case 'jwt expired':
                    res.error(401, err.message);
                    break;
                default: // invalid signature, jwt malformed, jwt must be provided
                    res.error(400, err.message);
                    break;
            }
            console.log('tokenERR: ', err.message, err.expiredAt);
        }
    } else if (req.cookie) {
        try {
            const { sid } = req.cookie;
            if (sid && typeof sid === 'string' && sid.length) next();
            else res.error(400, 'cookie invalid');
        } catch (err) {
            console.log('tokenERR:', err);
        }
    } else {
        res.error(400, 'token not provided');
    }
}
