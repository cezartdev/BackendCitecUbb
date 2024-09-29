import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import KeepFormatError from "../utils/KeepFormatErrors";

class Type {
    static dependencies = [];
    private static nombreTabla: string = "tipos";

    //Modelo SQL de la clase
    static async initTable(): Promise<void> {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.nombreTabla} (
                nombre VARCHAR(30) PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Tipos de usuario de inicio de sesion';
        `;
        const insertDataQuery = `
            INSERT INTO ${this.nombreTabla} (nombre) VALUES
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
            console.error(`Error al inicializar la tabla ${this.nombreTabla}:`, err);
            throw err;
        }
    }

    // Crear
    static async create(nombre: string): Promise<RowDataPacket> {
        const queryInsert = `INSERT INTO ${this.nombreTabla} (nombre) VALUES (?)`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE nombre = ?`;
        
        try {
            // Ejecuta la consulta de inserción
            const [result] = await db.execute<ResultSetHeader>(queryInsert, [nombre]);
    
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
        const querySelect = `SELECT * FROM ${this.nombreTabla}`;
        
        try {
            const [rows] = await db.execute<RowDataPacket[]>(querySelect);

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