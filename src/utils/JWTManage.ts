import jwt from 'jsonwebtoken';

const SECRET = 'DongaPmPma';

export async function getToken(payload:object){
    const result = await jwt.sign(payload,SECRET);
    return result
}

export async function decode(token:string){
    const result = await jwt.decode(token);
    return result
}

export async function verify(token:string){
    const result = await jwt.verify(token,SECRET);
    return result
}