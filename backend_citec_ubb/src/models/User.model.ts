import {db} from "../config/db"
import { ResultSetHeader } from 'mysql2/promise';

class User {
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