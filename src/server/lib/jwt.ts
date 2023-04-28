import { createVerify } from 'crypto'
import { HMACSHA256, btoa, atob } from '$server/lib/crypto.js'

function sign(claims: Record<string, string | number>, secret?: string, options?: Record<string, string | undefined>) {
    const header = {
        "alg": "HS256",
        "typ": "JWT"
    }
    const encodedHeaders = btoa(JSON.stringify(header))
    const encodedPlayload = btoa(JSON.stringify(claims))

    if (secret) {
        const signature = HMACSHA256(`${encodedHeaders}.${encodedPlayload}`, secret)
        const encodedSignature = btoa(signature)

        return `${encodedHeaders}.${encodedPlayload}.${encodedSignature}`
    }
}

function verify(token: string, secret?: string) {
    const [rawHead, rawBody, signature] = token.split(".");

    const parsedHead = decodeAndJsonParse<{ alg: string; kid: string }>(rawHead);
    const parsedBody = decodeAndJsonParse(rawBody)
    const decodeSig = atob(signature)

    if (secret) {
        const test = HMACSHA256(`${rawHead}.${rawBody}`, secret)
        const verified = signature === btoa(test)
        if (verified) {
            return parsedBody
        }
    }

    // const verifyObject = createVerify('HS256')
    // verifyObject.write(rawHead + "." + rawBody);
    // Close the stream
    //   verifyObject.end();
    // const signatureIsValid = verifyObject.verify({rawHead,parsedBody}, decodeSig, "base64")
    // verifyObject.write(rawHead + "." + rawBody);
    console.log(parsedHead, parsedBody, decodeSig)

    function decodeAndJsonParse<T>(base64: string): T & Record<string, any> {
        const json = atob(base64);
        return JSON.parse(json);
    }

}

export const jwt = { sign, verify }