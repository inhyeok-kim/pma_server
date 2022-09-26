import { Pool, PoolConnection } from "mysql2";
import { insert, list, select, update, remove } from "./Dao";

export interface Task {
    taskId? : string
    taskTitle? : string
    taskDescription? : string
    status? : 'P' | 'S' | 'D' | 'E' | ''
    startDt? : string
    requesterId? : string
    registTime? : Date
    progress? : number
    prId? : string
    importance? : number
    endDt? : string
    assignId? : string

    prName? : string
    requesterName? : string
    assignName? : string

    searchType? : 'or'
    page? : number
    perPage? : number
}

export async function selectTask(db:PoolConnection|Pool,{taskId}:Task){
    const result = await select(db,`
        SELECT TASK_ID AS taskId,
            TASK_TITLE AS taskTitle,
            TASK_DESCRIPTION AS taskDescription,
            START_DT AS startDt,
            END_DT AS endDt,
            REGIST_TIME AS registTim,
            PR_ID AS prId,
            REQUESTER_ID AS requesterId,
            ASSIGN_ID AS assignId,
            STATUS AS status,
            IMPORTANCE AS importance,
            PROGRESS AS progress,
            (SELECT PR_NAME FROM PROJECT WHERE PR_ID = prId) AS prName,
            (SELECT NAME FROM MEMBER WHERE MEM_ID = requesterId) AS requesterName,
            (SELECT NAME FROM MEMBER WHERE MEM_ID = assignId) AS assignName
        FROM TASK
        WHERE 1=1
            AND TASK_ID = '${taskId}'
    `);
    return result
}

export async function selectTaskList(db:PoolConnection|Pool,
        {
            taskTitle,
            status,
            startDt,
            endDt,
            requesterId,
            assignId,
            requesterName,
            assignName,
            prId,
            searchType,
            page,
            perPage,
        }:Task
    ){
    const result = await list(db,`
        SELECT TASK_ID AS taskId,
            TASK_TITLE AS taskTitle,
            TASK_DESCRIPTION AS taskDescription,
            START_DT AS startDt,
            END_DT AS endDt,
            REGIST_TIME AS registTim,
            PR_ID AS prId,
            REQUESTER_ID AS requesterId,
            ASSIGN_ID AS assignId,
            STATUS AS status,
            IMPORTANCE AS importance,
            PROGRESS AS progress,
            (SELECT PR_NAME FROM PROJECT WHERE PR_ID = prId) AS prName,
            (SELECT NAME FROM MEMBER WHERE MEM_ID = requesterId) AS requesterName,
            (SELECT NAME FROM MEMBER WHERE MEM_ID = assignId) AS assignName
        FROM TASK t
        WHERE 1 = 1
            AND STATUS != 'D'
        ${taskTitle ? `AND TASK_TITLE LIKE '%${taskTitle}%'` : ''}
        ${status ? `AND STATUS = '${status}'` : ''}
        ${searchType ? 
            searchType === 'or' ? 
                `
                    AND (
                        ${requesterId ? `REQUESTER_ID = '${requesterId}'` : ''}
                        OR
                        ${assignId ? `ASSIGN_ID = '${assignId}'` : ''}
                    )
                    ` 
            : 
                ``
        :
            `
                ${requesterId ? `AND REQUESTER_ID = '${requesterId}'` : ''}
                ${assignId ? `AND ASSIGN_ID = '${assignId}'` : ''}
                ${requesterName ? `AND REQUESTER_ID IN (SELECT MEM_ID FROM MEMBER WHERE NAME LIKE '%${requesterName}%')` : ''}
                ${assignName ? `AND REQUESTER_ID IN (SELECT MEM_ID FROM MEMBER WHERE NAME LIKE '%${assignName}%')` : ''}
            `
        }
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

export async function selectTaskListCnt(db:PoolConnection|Pool,
        {
            taskTitle,
            status,
            startDt,
            endDt,
            requesterId,
            assignId,
            requesterName,
            assignName,
            prId,
            searchType,
            page,
            perPage,
        }:Task
    ){
    const result = await select(db,`
        SELECT COUNT(TASK_ID) cnt
        FROM TASK t
        WHERE 1 = 1
            AND STATUS != 'D'
        ${taskTitle ? `AND TASK_TITLE LIKE '%${taskTitle}%'` : ''}
        ${status ? `AND STATUS = '${status}'` : ''}
        ${searchType ? 
            searchType === 'or' ? 
                `
                    AND (
                        ${requesterId ? `REQUESTER_ID = '${requesterId}'` : ''}
                        OR
                        ${assignId ? `ASSIGN_ID = '${assignId}'` : ''}
                    )
                    ` 
            : 
                ``
        :
            `
                ${requesterId ? `AND REQUESTER_ID = '${requesterId}'` : ''}
                ${assignId ? `AND ASSIGN_ID = '${assignId}'` : ''}
                ${requesterName ? `AND REQUESTER_ID IN (SELECT MEM_ID FROM MEMBER WHERE NAME LIKE '%${requesterName}%')` : ''}
                ${assignName ? `AND REQUESTER_ID IN (SELECT MEM_ID FROM MEMBER WHERE NAME LIKE '%${assignName}%')` : ''}
            `
        }
        ${prId ? `AND PR_ID = '${prId}'` : ''}
        ${startDt && endDt ? `AND (
            START_DT BETWEEN '${startDt}' AND '${endDt}' 
            OR END_DT BETWEEN '${startDt}' AND '${endDt}'
            OR (START_DT < '${startDt}' AND END_DT > '${endDt}')
        )` : ''}
    `);
    return result;
}

export async function insertTask(db:PoolConnection,
    {
        taskId,
        taskTitle,
        taskDescription,
        status,
        startDt,
        requesterId,
        progress,
        prId,
        importance,
        endDt,
        assignId
    }:Task
){
    const result = await insert(db,`
        INSERT INTO TASK
        (
            TASK_ID,
            TASK_TITLE,
            TASK_DESCRIPTION,
            STATUS,
            START_DT,
            REQUESTER_ID,
            REGIST_TIME,
            PROGRESS,
            PR_ID,
            IMPORTANCE,
            END_DT,
            ASSIGN_ID
        ) 
        VALUES
        (
            '${taskId}',
            '${taskTitle}',
            '${taskDescription}',
            '${status}',
            '${startDt}',
            '${requesterId}',
            now(),
            ${progress},
            '${prId}',
            ${importance},
            '${endDt}',
            '${assignId}'
        )
    `);
    return result;
}

export async function updateTask(db:PoolConnection|Pool,{
    taskId,
    taskTitle,
    taskDescription,
    status,
    startDt,
    requesterId,
    progress,
    prId,
    importance,
    endDt,
    assignId
}:Task){
    const result = await update(db,`
        UPDATE TASK SET
            TASK_TITLE = '${taskTitle}',
            TASK_DESCRIPTION = '${taskDescription}',
            STATUS = '${status}',
            START_DT = '${startDt}',
            REQUESTER_ID = '${requesterId}',
            PROGRESS = ${progress},
            PR_ID = '${prId}',
            IMPORTANCE = ${importance},
            END_DT = '${endDt}',
            ASSIGN_ID = '${assignId}'
        WHERE TASK_ID = '${taskId}'
    `);
    return result;
}

export async function deleteTask(db:PoolConnection|Pool, {
    taskId
}: Task){
    const result = await remove(db,`
        DELETE FROM TASK
        WHERE TASK_ID = '${taskId}'
    `);
    return result;
}
    