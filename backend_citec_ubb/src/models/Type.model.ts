import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import KeepFormatError from "../utils/KeepFormatErrors";

class Type {
    //Modelo SQL de la clase
    static async initTable(): Promise<void> {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS tipos (
                nombre VARCHAR(30) PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        const insertDataQuery = `
            INSERT INTO tipos (nombre) VALUES
            ('admin'),
            ('usuario')
            ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);
        `;

        try {
            // Crear la tabla si no existe
            await db.query(createTableQuery);
            // Insertar valores por defecto si es necesario
            await db.query(insertDataQuery);
        } catch (err) {
            console.error('Error al inicializar la tabla tipo:', err);
            throw err;
        }
    }

    // Crear
    static async create(nombre: string): Promise<RowDataPacket> {
        const queryInsert = 'INSERT INTO tipos (nombre) VALUES (?)';
        const querySelect = 'SELECT * FROM tipos WHERE nombre = ?';
        
        try {
            // Ejecuta la consulta de inserción
            const [result] = await db.execute<ResultSetHeader>(queryInsert, [nombre]);

            console.log(result);
    
            const insertId = result.insertId;

            // Ejecutamos la consulta para obtener los datos completos del usuario
            const [rows] = await db.execute<RowDataPacket[]>(querySelect, [insertId]);

            // Devolvemos
            return rows[0];
        } catch (err) {
            throw err;
        }
    }

    // Obtener todos 
    static async getAll(): Promise<RowDataPacket[]> {
        const querySelect = 'SELECT * FROM tipos';
        
        try {
            const [rows] = await db.execute<RowDataPacket[]>(querySelect);

            
            // Devolvemos
            return rows;
        } catch (err) {
            throw err;
        }
    }

    // Obtener por ID


    // Actualizar 


    // Eliminar

}

export default Type;