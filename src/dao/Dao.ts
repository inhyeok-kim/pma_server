import { Pool, PoolConnection } from "mysql2";

export function select(db:Pool|PoolConnection,query:string){
    return new Promise((resolve,reject)=>{
        db.query(query,(err,rows)=>{
            if(err){
                console.log(err);
                resolve(false);
            }
            if(Array.isArray(rows)){
                if(rows.length > 1){
                    console.log(`
                    1개 이상의 결과 발생\n
                    ${query}\n
                    `,rows);
                    resolve(false);
                } else {
                    if(rows.length === 0){
                        resolve({});
                    } else {
                        resolve(rows[0]);
                    }
                }
            } else {
                resolve(rows);
            }
        });
    });
}

export function list(db:Pool|PoolConnection,query:string){
    return new Promise((resolve,reject)=>{
        db.query(query,(err,rows)=>{
            if(err){
                console.log(err);
                resolve(false);
            }
            resolve(rows);
        });
    });
}

export function insert(db:Pool|PoolConnection,query:string){
    return new Promise((resolve,reject)=>{
        db.query(query,(err,rows)=>{
            if(err){
                console.log(err);
                resolve(false);
            }
            resolve(true);
        });
    });
}

export function update(db:Pool|PoolConnection,query:string){
    return new Promise((resolve,reject)=>{
        db.query(query,(err,rows)=>{
            if(err){
                console.log(err);
                resolve(false);
            }
            resolve(true);
        });
    });
}

export function remove(db:Pool|PoolConnection,query:string){
    return new Promise((resolve,reject)=>{
        db.query(query,(err,rows)=>{
            if(err){
                console.log(err);
                resolve(false);
            }
            resolve(true);
        });
    });
}