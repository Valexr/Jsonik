import { jwt } from '$server/lib/jwt'
import type { Next, Req, Res } from '$server/http/types';

export function token(req: Req, res: Res, next: Next) {
    const token = jwt.sign({
        iss: 'jsonik', // (issuer),
        sub: 1234567890, // (subject)
        aud: 'domain', // (audience)
        name: "John Doe",
        admin: true,
        iat: 1516239022,
        exp: 12312312312, // (expiration time)
    }, 'secret', {})
    const verified = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjJ9.OWQ0MjQ0NWY5MWUxMmVjYzRjYTg0OGVlNTQ1ZjUwY2U1YTYzN2E5YmFkOWQ5ZjRiN2ZhZDY0MGM1ZGJlMzI5Ng==', 'secret')
    console.log('T:', token, verified)
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
