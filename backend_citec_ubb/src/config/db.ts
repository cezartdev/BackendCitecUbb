import dotenv from 'dotenv';
import mysql, { Connection } from 'mysql2';

dotenv.config()

const db: Connection = mysql.createConnection(process.env.DATABASE_URL!);


export default db