import db from "../config/db"
import { ResultSetHeader } from 'mysql2/promise';

class User {
    //Modelo SQL de la clase
    static async initTable(): Promise<void> {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        const insertDataQuery = `
            INSERT INTO users (name, email, password) VALUES
            ('Admin', 'admin@example.com', 'admin123'),
            ('User', 'user@example.com', 'user123')
            ON DUPLICATE KEY UPDATE name = VALUES(name);
        `;

        try {
            // Crear la tabla si no existe
            await db.query(createTableQuery);
            // Insertar valores por defecto si es necesario
            await db.query(insertDataQuery);
        } catch (err) {
            console.error('Error al inicializar la tabla users:', err);
            throw err;
        }
    }


    // Crear un nuevo usuario
    static async create(name: string, email: string, password: string): Promise<ResultSetHeader> {
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        try {
            // Ejecuta la consulta
            const [result] = await db.execute<ResultSetHeader>(query, [name, email, password]);
            return result; // Retorna el resultado de la inserción
        } catch (err) {
            throw err;
        }
    }

    // Obtener todos los usuarios


    // Obtener un usuario por ID


    // Actualizar un usuario


    // Eliminar un usuario

}

export default User;  // Usar export default