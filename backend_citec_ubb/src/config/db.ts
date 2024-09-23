import dotenv from "dotenv";
import mysql, { Pool } from "mysql2/promise"; // Importa Pool en lugar de Connection

dotenv.config();

// Usando createPool con el enlace de conexión de la base de datos
const db: Pool = mysql.createPool({
  uri: process.env.DATABASE_URL!,
  waitForConnections: true,
  connectionLimit: 5, // Límite máximo de conexiones
  queueLimit: 0, // Sin límite en la cola
});



export default db;
