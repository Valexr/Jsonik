import { scryptSync, randomBytes, randomUUID, createHmac, createSecretKey, createVerify } from 'crypto';

const encryptPassword = (password: string, salt: string) =>
    scryptSync(password, salt, 32).toString('hex');

export const hashPassword = (password: string) => {
    const salt = randomBytes(16).toString('hex');
    console.log(salt);
    return encryptPassword(password, salt) + salt;
};
export const matchPassword = (password: string, hash: string) =>
    hash.slice(0, 64) === encryptPassword(password, hash.slice(64));

export const UUID = () => randomUUID();

export const HMACSHA256 = (string: string, secret: string) => {
    //creating hmac object 
    const hmac = createHmac('sha256', secret);
    //passing the data to be hashed
    const data = hmac.update(string);
    //Creating the hmac in the required format
    const gen_hmac = data.digest('hex');
    //Printing the output on the console
    // console.log("hmac : " + gen_hmac);
    return gen_hmac
}

export function btoa(text: string) {
    return Buffer.from(text, 'binary').toString('base64');
}

export function atob(base64: string) {
    return Buffer.from(base64, 'base64').toString('binary');
}
