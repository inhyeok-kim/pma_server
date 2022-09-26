import { Pool, PoolConnection } from "mysql2";
import { list, select } from "./Dao";

export interface Member {
    memId? : string
    name? : string
    isDelete? : string
    password? : string
    registTime? : Date
    job? : string
    belong? : string
    page? : number
    perPage? : number
}

export async function selectMember(db:Pool|PoolConnection,{memId}:Member){
    const result = await select(db,`
        SELECT MEM_ID as memId,
            NAME as name,
            REGIST_TIME as registTime,
            IS_DELETE as isDelete,
            JOB as job,
            BELONG as belong
        FROM MEMBER 
        WHERE MEM_ID = '${memId}'
    `);
    return result
}

export async function memberLogin(db:Pool,{id,pwd}:{id:string,pwd:string}){
    const result = await select(db,`
        SELECT * FROM MEMBER 
        WHERE MEM_ID = '${id}'
        AND PASSWORD = '${pwd}'`
    );
    return result;
}

export async function selectMemberList(db:Pool,
        {
            memId,
            name,
            isDelete,
            page,
            perPage,
        }:Member
    ){
    const result = await list(db,`
        SELECT MEM_ID as memId,
            NAME as name,
            REGIST_TIME as registTime,
            IS_DELETE as isDelete,
            JOB as job,
            BELONG as belong
        FROM MEMBER 
        WHERE 1 = 1
        ${memId ? `AND MEM_ID != '${memId}'`:''}
        ${name ? `AND NAME LIKE '%${name}%'`:''}
        ${isDelete ? `AND IS_DELETE = ${isDelete}`:''}
        ${page && perPage ? `LIMIT ${perPage} OFFSET ${perPage * page}` :''}
    `);
    return result;
}