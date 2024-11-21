import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import KeepFormatError from "../utils/KeepFormatErrors";
class Services {
    //Modelo SQL de la clase
    static dependencies = [];
    private static nombreTabla: string = "servicios";

    static async initTable(): Promise<void> {
       
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.nombreTabla} (
                nombre VARCHAR(200) NOT NULL COMMENT 'nombre del servicio',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (nombre)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Lista de claves';
        `;

        
        // const insertDataQuery = `
        //     INSERT INTO ${this.nombreTabla} (url, clave) VALUES 
        //         ('','')
        //         ON DUPLICATE KEY UPDATE clave = VALUES(clave);
        // `;

        try {
            // Crear la tabla si no existe
            await db.query(createTableQuery);
            // Insertar valores por defecto si es necesario
            // await db.query(insertDataQuery);
        } catch (err) {
            console.error(`Error al inicializar la tabla ${this.nombreTabla}:`, err);
            throw err;
        }
    }

    static async create(nombre: string): Promise<RowDataPacket> {
        const queryInsert = `INSERT INTO ${this.nombreTabla} (nombre) VALUES (?)`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE nombre = ?`;

        
        try {
            //Se comprueba si el servicio existe
            const [service] = await db.execute<RowDataPacket[]>(querySelect, [nombre]);
            if (service[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "El servicio que intenta crear ya existe",
                        value: `${nombre}`,
                        path: "nombre",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 409);
            }
            
            await db.execute<ResultSetHeader>(queryInsert, [nombre]);

            const serviceResult = await this.getById(nombre);

            return serviceResult;
        } catch (err) {
            throw err;
        }
    }
    

     // Obtener por ID
     static async getById(nombre: string): Promise<RowDataPacket> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE nombre = ?`;

        try {

            const [service] = await db.execute<RowDataPacket[]>(querySelect, [nombre]);
            if (!service[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Servicio no encontrado",
                        value: `${nombre}`,
                        path: "rut",
                        location: "params",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }
            
            return service[0];
        } catch (err) {
            throw err;
        }
    }


    // Obtener todos
    static async getAll(): Promise<RowDataPacket[]> {
        const querySelect = `SELECT * FROM ${this.nombreTabla}`;

        try {
            const [service] = await db.execute<RowDataPacket[]>(querySelect);

            if (!service[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "No existen servicios",
                        value: ``,
                        path: "",
                        location: "",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            return service;
        } catch (err) {
            throw err;
        }
    }

}

export default Services;