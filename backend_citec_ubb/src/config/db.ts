import dotenv from 'dotenv';
import mysql, { Pool } from 'mysql2/promise';  // Importa Pool en lugar de Connection

dotenv.config()

// Usando createPool con el enlace de conexión de la base de datos
const db: Pool = mysql.createPool({
    uri: process.env.DATABASE_URL!,
    waitForConnections: true,
    connectionLimit: 10,  // Límite máximo de conexiones
    queueLimit: 0         // Sin límite en la cola
});

// Crear tablas e insertar valores por defecto
const initDB = async () => {
    try {
        // Crea la tabla "users" si no existe
        const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
        await db.query(createUsersTableQuery);

        // Insertar valores por defecto si la tabla está vacía
        const insertDefaultUsersQuery = `
        INSERT INTO users (name, email, password) 
        SELECT * FROM (SELECT 'Admin', 'admin@example.com', 'adminpassword') AS tmp
        WHERE NOT EXISTS (
          SELECT email FROM users WHERE email = 'admin@example.com'
        ) LIMIT 1
      `;
        await db.query(insertDefaultUsersQuery);

        console.log('Base de datos inicializada correctamente.');
    } catch (error) {
        console.error('Error inicializando la base de datos:', error);
        throw error;
    }
};

export { db, initDB };

