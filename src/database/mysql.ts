import mysql from 'mysql2';
import fs from 'fs';
import path from 'path';

let conn : mysql.Pool | null = null;
try {
    const dbConfig = fs.readFileSync(path.join(__dirname,'../','config/database.json'),'utf-8');
    conn = mysql.createPool(JSON.parse(dbConfig));
} catch (error) {
    console.log(error);
    console.log('db connection failed');
    process.exit();
}
export default conn;
