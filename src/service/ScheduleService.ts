import { PoolConnection } from "mysql2";
import { makeSeq } from "../utils/SeqUtil";
import { setTransaction } from "./Service";
import db from '../database/mysql';
import { deleteSchedule, insertSchedule, selectSchedule, selectScheduleList, selectScheduleListCnt, Schedule, updateSchedule } from "../dao/ScheduleDao";

export async function registSchedule(Schedule : Schedule){
    let result = await setTransaction(async(conn : PoolConnection)=>{
        let flag = true;
        try {
            Schedule.schId = makeSeq();
            const _result = await insertSchedule(conn!,Schedule);
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
    return result;
}

export async function getScheduleList(Schedule:Schedule){
    const list = await selectScheduleList(db!,Schedule);
    const cnt = await selectScheduleListCnt(db!,Schedule);
    return {list, count:cnt};
}

export async function getSchedule(Schedule:Schedule){
    const list = await selectSchedule(db!,Schedule);
    return list;
}

export async function removeSchedule(Schedule:Schedule){
    const result = await setTransaction(async(conn : PoolConnection)=>{
        let flag = true;
        try {
            const _Schedule = await selectSchedule(conn!,Schedule) as Schedule;
            if(Schedule.registerId === _Schedule.registerId){
                const _result = await deleteSchedule(conn!,Schedule);
                if(!_result){
                    flag = false;
                    conn.rollback(()=>{});
                    conn.release();
                }
            } else {
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
    return result;
}

export async function modifySchedule(Schedule : Schedule){
    let result = await setTransaction(async(conn : PoolConnection)=>{
        let flag = true;
        try {
            const _Schedule = await selectSchedule(conn!,Schedule) as Schedule;
            if(Schedule.registerId === _Schedule.registerId){
                const _result = await updateSchedule(conn!,Schedule);
                if(!_result){
                    flag = false;
                    conn.rollback(()=>{});
                    conn.release();
                }
            } else {
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
    return result;
}