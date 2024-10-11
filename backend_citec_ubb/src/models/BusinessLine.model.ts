import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import KeepFormatError from "../utils/KeepFormatErrors";

class BussinessLine {
    static dependencies = ["categorias"];
    private static nombreTabla: string = "giros";

    //Modelo SQL de la clase
    static async initTable(): Promise<void> {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS giros (
                codigo INT PRIMARY KEY,
                nombre VARCHAR(200) NOT NULL,
                afecto_iva VARCHAR(2) NOT NULL,
                categoria VARCHAR(200) NOT NULL Default 'Sin categoría',
                FOREIGN KEY (categoria) REFERENCES categorias(nombre),                
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
//        const insertDataQuery = `
  //          INSERT INTO giros (codigo, nombre, afecto_iva, categorias) VALUES
//
    //            ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);
  //      `;

        try {
            // Crear la tabla si no existe
            await db.query(createTableQuery);
            // Insertar valores por defecto si es necesario
      //      await db.query(insertDataQuery);
        } catch (err) {
            console.error('Error al inicializar la tabla giros:', err);
            throw err;
        }
    }

    // Crear
    static async create(codigo: number, nombre: string, afecto_iva:string, categoria: string): Promise<RowDataPacket> {
        const queryInsert = 'INSERT INTO giros (nombre) VALUES (?)';
        const querySelect = 'SELECT * FROM giros WHERE nombre = ?';
        const queryCategory = `SELECT * FROM categorias WHERE nombre = ?`

        try {

            const [category] = await db.execute<ResultSetHeader>(queryCategory, [categoria]);

            if (!category[0]) {
                const errors = [{ type: "field", msg: "Error al crear giro", value: `${categoria}`, path: "nombre_categorias", location: "body" }]
                throw new KeepFormatError(errors);
            }

            // Ejecuta la consulta de inserción
            const [result] = await db.execute<ResultSetHeader>(queryInsert, [codigo, nombre, afecto_iva, categoria]);

            console.log(result);

            // Ejecutamos la consulta para obtener los datos completos del giro
            const [rows] = await db.execute<RowDataPacket[]>(querySelect, [codigo]);

            // Devolvemos
            return rows[0];
        } catch (err) {
            throw err;
        }
    }

    static async getAll(): Promise<RowDataPacket[]> {
        const querySelect = 'SELECT * FROM giros';

        try {
            const [rows] = await db.execute<RowDataPacket[]>(querySelect);


            // Devolvemos
            return rows;
        } catch (err) {
            throw err;
        }
    }

    // Obtener por ID
    static async getById(codigo: number): Promise<RowDataPacket> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE codigo = ?`;

        try {
            const [bussinessLine] = await db.execute<RowDataPacket[]>(querySelect, [codigo]);
            if (!bussinessLine[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Giro no encontrado",
                        value: `${codigo}`,
                        path: "codigo",
                        location: "params",
                    },
                ];
                throw new KeepFormatError(errors);
            }


            return bussinessLine[0];
        } catch (err) {
            throw err;
        }
    }
}

export default BussinessLine;