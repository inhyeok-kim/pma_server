import { PoolConnection } from "mysql2";
import { makeSeq } from "../utils/SeqUtil";
import { setTransaction } from "./Service";
import db from '../database/mysql';
import { Chat, ChatRoom, insertChat, insertChatMember, insertChatRoom, selectChat, selectChatList, selectChatRoom, selectDirectChatRoomIdWithMember, selectDirectChatRoomList } from "../dao/ChatDao";

export async function registChatRoom(room : ChatRoom){
    room.chrId = makeSeq();
    let result = await setTransaction(async(conn : PoolConnection)=>{
        let flag = true;
        try {
            
            const _result = await insertChatRoom(conn!,room);
            if(!_result){
                flag = false;
                conn.rollback(()=>{});
                conn.release();
            } else {
                for(let memId of room.membersId!){
                    const _result = await insertChatMember(conn!,{chrId : room.chrId ,memId : memId});
                    if(!_result){
                        flag = false;
                        conn.rollback(()=>{});
                        conn.release();
                        break;
                    }
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
    if(result){
        return room.chrId;
    }
    return result;
}

export async function getDirectChatRoomList(room:ChatRoom){
    const list = await selectDirectChatRoomList(db!,room);
    return list;
}

export async function getDirectChatRoomIdWithMember(room:ChatRoom){
    const result = await selectDirectChatRoomIdWithMember(db!,room);
    return result;
}

export async function getChatRoom(room:ChatRoom){
    const result = await selectChatRoom(db!,room);
    return result;
}

export async function registChat(chat : Chat){
    chat.chId = makeSeq();
    let result = await setTransaction(async(conn : PoolConnection)=>{
        let flag = true;
        try {
            
            const _result = await insertChat(conn!,chat);
            if(!_result){
                flag = false;
                conn.rollback(()=>{});
                conn.release();
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
    if(result){
        const chatResult = await selectChat(db!,chat);
        return chatResult;
    }
    return result;
}

export async function getChatList(chat:Chat){
    const list = await selectChatList(db!,chat);
    return list;
}

export async function getChat(chat:Chat){
    const chatResult = await selectChat(db!,chat);
    return chatResult;
}