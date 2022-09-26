import { Pool, PoolConnection } from "mysql2";
import { insert, list, select, update, remove } from "./Dao";

export interface Schedule {
    startTm ? : string
    startDt ? : string
    schTitle ? : string
    schId ? : string
    schDescription ? : string
    registerId ? : string
    registTime ? : string
    prId ? : string
    endTm ? : string
    endDt ? : string

    prName? : string
    registerName? : string

    page? : number
    perPage? : number
}

export async function selectSchedule(db:PoolConnection|Pool,{schId}:Schedule){
    const result = await select(db,`
        SELECT START_TM as startTm,
            START_DT as startDt,
            SCH_TITLE as schTitle,
            SCH_ID as schId,
            SCH_DESCRIPTION as schDescription,
            REGISTER_ID as registerId,
            REGIST_TIME as registTime,
            PR_ID as prId,
            END_TM as endTm,
            END_DT as endDt,
            (SELECT PR_NAME FROM PROJECT WHERE PR_ID = prId) AS prName,
            (SELECT NAME FROM MEMBER WHERE MEM_ID = registerId) AS registerName
        FROM SCHEDULE
        WHERE 1=1
            AND SCH_ID = '${schId}'
    `);
    return result
}

export async function selectScheduleList(db:PoolConnection|Pool,
        {
            startDt,
            endDt,
            registerId,
            registerName,
            prId,
            page,
            perPage,
        }:Schedule
    ){
    const result = await list(db,`
        SELECT START_TM as startTm,
            START_DT as startDt,
            SCH_TITLE as schTitle,
            SCH_ID as schId,
            SCH_DESCRIPTION as schDescription,
            REGISTER_ID as registerId,
            REGIST_TIME as registTime,
            PR_ID as prId,
            END_TM as endTm,
            END_DT as endDt,
            (SELECT PR_NAME FROM PROJECT WHERE PR_ID = prId) AS prName,
            (SELECT NAME FROM MEMBER WHERE MEM_ID = registerId) AS registerName
        FROM SCHEDULE t
        WHERE 1 = 1
            ${registerId ? `AND REGISTER_ID = '${registerId}'` : ''}
            ${registerName ? `AND REGISTER_ID IN (SELECT MEM_ID FROM MEMBER WHERE NAME LIKE '%${registerName}%')` : ''}
        ${prId ? `AND PR_ID = '${prId}'` : ''}
        ${startDt && endDt ? `AND (
            START_DT BETWEEN '${startDt}' AND '${endDt}' 
            OR END_DT BETWEEN '${startDt}' AND '${endDt}'
            OR (START_DT < '${startDt}' AND END_DT > '${endDt}')
        )` : ''}
        ${page && perPage ? `LIMIT ${perPage} OFFSET ${perPage * page}` :''} 
    `);
    return result;
}

export async function selectScheduleListCnt(db:PoolConnection|Pool,
        {
            startDt,
            endDt,
            registerId,
            registerName,
            prId
        }:Schedule
    ){
    const result = await select(db,`
        SELECT COUNT(SCH_ID) cnt
        FROM SCHEDULE t
        WHERE 1 = 1
            ${registerId ? `AND REGISTER_ID = '${registerId}'` : ''}
            ${registerName ? `AND REGISTER_ID IN (SELECT MEM_ID FROM MEMBER WHERE NAME LIKE '%${registerName}%')` : ''}
        ${prId ? `AND PR_ID = '${prId}'` : ''}
        ${startDt && endDt ? `AND (
            START_DT BETWEEN '${startDt}' AND '${endDt}' 
            OR END_DT BETWEEN '${startDt}' AND '${endDt}'
            OR (START_DT < '${startDt}' AND END_DT > '${endDt}')
        )` : ''}
    `);
    return result;
}

export async function insertSchedule(db:PoolConnection,
    {
        startTm,
        startDt,
        schTitle,
        schId,
        schDescription,
        registerId,
        prId,
        endTm,
        endDt
    }:Schedule
){
    const result = await insert(db,`
        INSERT INTO SCHEDULE
        (
            START_TM,
            START_DT,
            SCH_TITLE,
            SCH_ID,
            SCH_DESCRIPTION,
            REGISTER_ID,
            REGIST_TIME,
            PR_ID,
            END_TM,
            END_DT
        ) 
        VALUES
        (
            '${startTm}',
            '${startDt}',
            '${schTitle}',
            '${schId}',
            '${schDescription}',
            '${registerId}',
            now(),
            '${prId}',
            '${endTm}',
            '${endDt}'
        )
    `);
    return result;
}

export async function updateSchedule(db:PoolConnection|Pool,{
    startTm,
    startDt,
    schTitle,
    schId,
    schDescription,
    prId,
    endTm,
    endDt
}:Schedule){
    const result = await update(db,`
        UPDATE SCHEDULE SET
            START_TM = '${startTm}',
            START_DT = '${startDt}',
            SCH_TITLE = '${schTitle}',
            SCH_DESCRIPTION = '${schDescription}',
            PR_ID = '${prId}',
            END_TM = '${endTm}',
            END_DT = '${endDt}'
        WHERE SCH_ID = '${schId}'
    `);
    return result;
}

export async function deleteSchedule(db:PoolConnection|Pool, {
    schId
}: Schedule){
    const result = await remove(db,`
        DELETE FROM SCHEDULE
        WHERE SCH_ID = '${schId}'
    `);
    return result;
}
    