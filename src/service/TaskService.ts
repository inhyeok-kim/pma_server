import { PoolConnection } from "mysql2";
import { makeSeq } from "../utils/SeqUtil";
import { setTransaction } from "./Service";
import db from '../database/mysql';
import { deleteTask, insertTask, selectTask, selectTaskList, selectTaskListCnt, Task, updateTask } from "../dao/TaskDao";

export async function registTask(task : Task){
    let result = await setTransaction(async(conn : PoolConnection)=>{
        let flag = true;
        try {
            task.taskId = makeSeq();
            const _result = await insertTask(conn!,task);
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

export async function getTaskList(task:Task){
    const list = await selectTaskList(db!,task);
    const cnt = await selectTaskListCnt(db!,task);
    return {list, count:cnt};
}

export async function getTask(task:Task){
    const list = await selectTask(db!,task);
    return list;
}

export async function removeTask(task:Task){
    const result = await setTransaction(async(conn : PoolConnection)=>{
        let flag = true;
        try {
            const _task = await selectTask(conn!,task) as Task;
            if(task.requesterId === _task.requesterId){
                const _result = await deleteTask(conn!,task);
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

export async function modifyTask(task : Task){
    let result = await setTransaction(async(conn : PoolConnection)=>{
        let flag = true;
        try {
            const _task = await selectTask(conn!,task) as Task;
            if(task.requesterId === _task.requesterId){
                const _result = await updateTask(conn!,task);
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