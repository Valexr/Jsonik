import { jwt } from '$server/lib/jwt.js'
import type { Next, Req, Res } from '$server/http/types.js';

export function token(req: Req, res: Res, next: Next) {
    const token = jwt.sign({
        sub: "1234567890",
        name: "Quincy Larson",
        iat: 1516239022
    }, 'secret', {})
    const verified = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlF1aW5jeSBMYXJzb24iLCJpYXQiOjE1MTYyMzkwMjJ9.OGVhYzBjZDM2M2FkOTc4ZGY4MjNmZWM4MWZhNWE5MjI4ZWNkN2M1MTZmY2JmNTFjODZkNzg1ZDM0N2U0NmMwMA==', 'secret')
    console.log(token, verified)
    if (req.token) {
        try {
            const token = req.token;
            const verified = jwt.verify(token, process.env.JWT_SECRET);
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
        // next()
        res.error(400, 'token not provided');
    }
}
