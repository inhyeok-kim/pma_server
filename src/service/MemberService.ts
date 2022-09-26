import { Member, selectMember, selectMemberList } from "../dao/MemberDao";
import db from '../database/mysql';

export async function getMemberList(search : Member){
    const list = await selectMemberList(db!,search);
    return list;
}

export async function getMember(search : Member){
    const list = await selectMember(db!,search);
    return list;
}

