import { Member, selectMemberList } from "../dao/MemberDao";
import db from '../database/mysql';

export async function seachMemberList(search : Member){
    const list = await selectMemberList(db!,search);
    return list;
}