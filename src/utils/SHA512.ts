import crypto from 'crypto';

export function encrypt(str : string){
    return crypto.createHash('sha512').update(str).digest('base64');
}