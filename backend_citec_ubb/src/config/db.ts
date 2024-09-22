import dotenv from 'dotenv';
import mysql, { Connection } from 'mysql2';

dotenv.config()

const db: Connection = mysql.createConnection(process.env.DB_URL!);

db.connect((err) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
  });

export default db