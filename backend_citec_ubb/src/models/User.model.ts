import db from "../config/db"
import { RowDataPacket, ResultSetHeader, Query } from 'mysql2/promise';

class User {
     // Crear un nuevo usuario
     static async create(name: string, email: string, password: string): Promise<Query> {
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        try {
            // Realiza la consulta y guarda el resultado directamente
            const result = await db.execute(query, [name, email, password]);
            
            return result; // Devuelve el resultado de la inserción
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