import { scryptSync, randomBytes, randomUUID } from 'crypto';

const encryptPassword = (password: string, salt: string) => scryptSync(password, salt, 32).toString('hex');

export const hashPassword = (password: string) => {
    const salt = randomBytes(16).toString('hex');
    console.log(salt);
    return encryptPassword(password, salt) + salt;
};
export const matchPassword = (password: string, hash: string) => hash.slice(0, 64) === encryptPassword(password, hash.slice(64));

export const UUID = () => randomUUID();
