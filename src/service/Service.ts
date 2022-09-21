import db from '../database/mysql';

export function setTransaction(func : Function){
    return new Promise((resolve, reject)=>{
        db?.getConnection(async (err,conn)=>{
            if(err){
                if(conn) conn.release();
                reject(err);
            }
            conn.beginTransaction(async (err)=>{
                if(err){
                    console.log(err);
                    reject(false);
                }
                const result = await func(conn);
                conn.release();
                resolve(result);
            });
        });
    })
}