import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import KeepFormatError from "../utils/KeepFormatErrors";

class Category {
    //modelo SQL de la clase
    static async initTable(): Promise<void> {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS categorias (
                nombre VARCHAR(200) PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        const insertDataQuery = `
            INSERT INTO categorias (nombre) VALUES
            ('INDUSTRIA MANUFACTURERA'),
            ('CONSTRUCCIÓN'),
            ('COMERCIO AL POR MAYOR Y AL POR MENOR; REPARACIÓN DE VEHICULOS AUTOMOTORES Y MOTOCICLETAS'),
            ('AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA'),
            ('SUMINISTRO DE ELECTRICIDAD, GAS, VAPOR Y AIRE ACONDICIONADO')

            ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);
        `;

        try {
            // Crear la tabla si no existe
            await db.query(createTableQuery);
            // Insertar valores por defecto si es necesario
            await db.query(insertDataQuery);
        } catch (err) {
            console.error('Error al inicializar la tabla categorias:', err);
            throw err;
        }
    }

    static async create(nombre: string): Promise<RowDataPacket> {
        const queryInsert = 'INSERT INTO categorias (nombre) VALUES (?)';
        const querySelect = 'SELECT * FROM categorias WHERE nombre = ?';

        try {
            // Ejecuta la consulta de inserción
            const [result] = await db.execute<ResultSetHeader>(queryInsert, [nombre]);

            console.log(result);

            const insertId = result.insertId;

            // Ejecutamos la consulta para obtener los datos completos de la categoria
            const [rows] = await db.execute<RowDataPacket[]>(querySelect, [insertId]);

            // Devolvemos
            return rows[0];
        } catch (err) {
            throw err;
        }
    }

    // Obtener todos 
    static async getAll(): Promise<RowDataPacket[]> {
        const querySelect = 'SELECT * FROM categorias';

        try {
            const [rows] = await db.execute<RowDataPacket[]>(querySelect);


            // Devolvemos
            return rows;
        } catch (err) {
            throw err;
        }
    }
}

export default Category;
