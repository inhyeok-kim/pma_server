import db from '../database/mysql';
import { memberLogin } from '../dao/MemberDao';
import { encrypt } from '../utils/SHA512';

export async function login({id,pwd}:{id:string,pwd:string}){
    const result = await memberLogin(db!,{
        id : id,
        pwd : encrypt(pwd)
    });
    return result;
}