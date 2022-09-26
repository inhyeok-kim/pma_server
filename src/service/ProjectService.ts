import { PoolConnection } from "mysql2";
import { insertProject, insertProjectMember, Project, selectProject, selectProjectList, selectProjectListOfMember } from "../dao/ProjectDao";
import { makeSeq } from "../utils/SeqUtil";
import { setTransaction } from "./Service";
import db from '../database/mysql';

export async function registProject(project : Project){
    let result = await setTransaction(async(conn : PoolConnection)=>{
        let flag = true;
        try {
            project.prId = makeSeq();
            const _result = await insertProject(conn!,project);
            if(!_result){
                flag = false;
                conn.rollback(()=>{});
                conn.release();
            }

            for(let member of project.members!){
                const _result = await insertProjectMember(conn!,project.prId!,member.memId!);
                if(!_result){
                    flag = false;
                    conn.rollback(()=>{});
                    conn.release();
                    break;
                }
            }
        } catch (error) {
            flag = false;
            conn.rollback(()=>{});
            conn.release();
        } finally {
            if(flag){
                conn.commit();
            }
            conn.release();
        }
        return flag;
    });
    return result;
}

export async function getProjectList(project:Project){
    const list = await selectProjectList(db!,project);
    return list;
}

export async function getProjectListOfMember(memId:string){
    const list = await selectProjectListOfMember(db!,memId);
    return list;
}

export async function getProject(prId:string){
    const result = await selectProject(db!,prId);
    return result;
}