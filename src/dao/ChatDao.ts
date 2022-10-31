import { Pool, PoolConnection } from "mysql2";
import { insert, list, select } from "./Dao";

export interface Chat {
    chId? : string
    chContent? : string
    chrId? : string
    registerId? : string
    registTime? : string
    isThread? : string
    upperCh? : string
    registerName? : string

    startDate? : Date
    endDate? : Date
    page? : number
    perPage? : number
}
export interface ChatRoom {
    chrId? : string
    prId? : string
    isDirect? : string

    membersId? : string[]
    membersName? : string[]
    memId? : string
    name? : string

    page? : number
    perPage? : number
}

export async function selectDirectChatRoomList(db:Pool|PoolConnection,{
        memId
    }:ChatRoom){
    const result = await list(db,`
        SELECT cr.CHR_ID as chrId,
            IS_DIRECT as isDirect,
            GROUP_CONCAT(cm.MEM_ID) as memId,
            GROUP_CONCAT(m.NAME) as name
        FROM CHAT_ROOM cr, CHAT_MEMBER cm, MEMBER m
        WHERE 1=1 
            AND cr.CHR_ID = cm.CHR_ID
            AND m.MEM_ID  = cm.MEM_ID 
            AND m.MEM_ID != '${memId}'
            AND cr.IS_DIRECT = 'Y'
            AND cr.CHR_ID IN (SELECT CHR_ID FROM CHAT_MEMBER cm2 WHERE cm2.MEM_ID = '${memId}')
        GROUP BY cr.CHR_ID
    `);
    return result
}

export async function selectChatRoom(db:Pool|PoolConnection,{
    chrId,
    prId
    }:ChatRoom){
    const result = await select(db,`
        SELECT cr.CHR_ID as chrId,
            IS_DIRECT as isDirect,
            GROUP_CONCAT(cm.MEM_ID) as memId,
            GROUP_CONCAT(m.NAME) as name
        FROM CHAT_ROOM cr, CHAT_MEMBER cm, MEMBER m
        WHERE 1=1 
            AND cr.CHR_ID = cm.CHR_ID
            AND m.MEM_ID  = cm.MEM_ID 
            ${chrId? `AND cr.CHR_ID = '${chrId}'`:''}
            ${prId? `AND cr.PR_ID = '${prId}'`:''}
        GROUP BY cr.CHR_ID
    `);
    return result
}

export async function selectDirectChatRoomIdWithMember(db:Pool|PoolConnection,{
        membersId
    }:ChatRoom){
    const result = await select(db,`
        SELECT cr.CHR_ID as chrId
        FROM CHAT_ROOM cr, CHAT_MEMBER cm
        WHERE 1=1 
            AND cr.CHR_ID = cm.CHR_ID
            AND cm.MEM_ID  = '${membersId![1]}'
            AND cr.IS_DIRECT = 'Y'
            AND cr.CHR_ID IN (
                SELECT cr.CHR_ID
                FROM CHAT_MEMBER
                WHERE 1=1
                    AND MEM_ID = '${membersId![0]}'
            )
    `);
    return result
}

export async function insertChatRoom(db:PoolConnection|Pool,{
    chrId,
    prId,
    isDirect
}:ChatRoom){
    const result = await insert(db,`
        INSERT INTO CHAT_ROOM
        (
            CHR_ID,
            PR_ID,
            IS_DIRECT
        ) 
            VALUES
        (
            '${chrId}',
            '${prId}',
            '${isDirect}'
        )
    `);
    return result;
}

export async function insertChatMember(db:PoolConnection|Pool,{
    chrId,
    memId
}:ChatRoom){
    const result = await insert(db,`
        INSERT INTO CHAT_MEMBER
        (
            CHR_ID,
            MEM_ID
        ) 
            VALUES
        (
            '${chrId}',
            '${memId}'
        )
    `);
    return result;
}

export async function insertChat(db:PoolConnection|Pool,{
    chId,
    chContent,
    chrId,
    registerId,
    isThread,
    upperCh
}:Chat){
    const result = await insert(db,`
        INSERT INTO CHAT
        (
            CH_ID,
            CH_CONTENT,
            CHR_ID,
            REGISTER_ID,
            REGIST_TIME,
            IS_THREAD,
            UPPER_CH
        ) 
            VALUES
        (
            '${chId}',
            '${chContent}',
            '${chrId}',
            '${registerId}',
            now(),
            '${isThread}',
            '${upperCh}'
        )
    `);
    return result;
}

export async function selectChatList(db:PoolConnection|Pool,{
    chrId,
    registerId,
    isThread,
    upperCh,
    startDate,
    endDate,
    page,
    perPage,
}:Chat){
    const result = await list(db,`
        SELECT CH_ID as chId,
            CH_CONTENT as chContent,
            CHR_ID as chrId,
            REGISTER_ID as registerId,
            REGIST_TIME as registTime,
            CASE WHEN (SELECT COUNT(CHR_ID) FROM CHAT WHERE UPPER_CH = chId) > 0 THEN 'Y'
                ELSE 'N' END as isThread,
            UPPER_CH as upperCh,
            (SELECT NAME FROM MEMBER WHERE MEM_ID = registerId) as registerName
        FROM CHAT
        WHERE 1=1
            AND CHR_ID = '${chrId}'
            ${startDate ? `AND REGIST_TIME >= '${startDate}'`:''}
            ${endDate ? `AND REGIST_TIME <= '${endDate}'`:''}
            ${upperCh ? `AND UPPER_CH = '${upperCh}'`: `AND UPPER_CH = 'undefined'`}
        ORDER BY registTime
    `);
    return result;
}

export async function selectChat(db:PoolConnection|Pool,{
    chId,
}:Chat){
    const result = await select(db,`
        SELECT CH_ID as chId,
            CH_CONTENT as chContent,
            CHR_ID as chrId,
            REGISTER_ID as registerId,
            REGIST_TIME as registTime,
            IS_THREAD as isThread,
            UPPER_CH as upperCh,
            (SELECT NAME FROM MEMBER WHERE MEM_ID = registerId) as registerName
        FROM CHAT
        WHERE 1=1
            AND CH_ID = '${chId}'
    `);
    return result;
}