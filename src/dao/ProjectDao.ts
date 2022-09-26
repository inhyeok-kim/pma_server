import { Pool, PoolConnection } from "mysql2";
import { insert, list, select } from "./Dao";
import { Member } from "./MemberDao";

export interface Project {
    prId? : string
    prName? : string
    prDescription? : string
    isPrivate? : 'N' | 'Y'
    startDt? : string
    endDt? : string
    register? : string
    registTime? : Date
    status? : 'P' | 'E' | 'S' | 'D'
    members? : Member[]
    page? : number
    perPage? : number
}

export async function selectProjectList(db:PoolConnection|Pool,
        {
            prName,
            isPrivate,
            register,
            status,
            startDt,
            endDt,
            page,
            perPage,
        }:Project
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
    `);
    return result;
}

export async function insertProject(db:PoolConnection,
    {
        prId,
        prName,
        prDescription,
        isPrivate,
        startDt,
        endDt,
        register,
        status,
    }:Project
){
    const result = await insert(db,`
    INSERT INTO PROJECT
    (
        PR_ID,
        PR_NAME,
        PR_DESCRIPTION,
        IS_PRIVATE,
        START_DT,
        END_DT,
        REGISTER,
        REGIST_TIME,
        STATUS
        ) 
    VALUES
    (
        '${prId}',
        '${prName}',
        '${prDescription}',
        '${isPrivate}',
        '${startDt}',
        '${endDt}',
        '${register}',
        NOW(),
        '${status}'
        )
        `);
        return result;
    }
    
export async function insertProjectMember(db:PoolConnection,
    prId : string,
    memId : string
    ){
        const result = await insert(db,`
        INSERT INTO PROJECT_MEMBER
        (
            PR_ID,
            MEM_ID,
            REGIST_TIME
            ) 
            VALUES
            (
            '${prId}',
            '${memId}',
            NOW()
            )
        `);
    return result;
}

export async function selectProjectListOfMember(db:PoolConnection|Pool,
    memId : string
){
const result = await list(db,`
    SELECT p.PR_ID as prId,
        PR_NAME as prName,
        PR_DESCRIPTION as prDescription,
        IS_PRIVATE as isPrivate,
        START_DT as startDt,
        END_DT as endDt,
        REGISTER as register,
        p.REGIST_TIME as registTime,
        STATUS as status
    FROM PROJECT p, PROJECT_MEMBER pm
    WHERE p.PR_ID = pm.PR_ID
        AND pm.MEM_ID = '${memId}'
`);
return result;
}

export async function selectProject(db:PoolConnection|Pool,prId:string){
    const result = await select(db,`
        SELECT p.PR_ID as prId,
            PR_NAME as prName,
            PR_DESCRIPTION as prDescription,
            IS_PRIVATE as isPrivate,
            START_DT as startDt,
            END_DT as endDt,
            REGISTER as register,
            p.REGIST_TIME as registTime,
            STATUS as status
        FROM PROJECT p
        WHERE PR_ID = '${prId}'
    `);
    return result;
}