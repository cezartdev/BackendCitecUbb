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



    // // Obtener por ID
    // static async getById(url: string): Promise<RowDataPacket> {
    //     const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE url = ?`;
        
    //     try {

    //         const [keyArray] = await db.execute<RowDataPacket[]>(querySelect, [url]);
    //         if (!keyArray[0]) {
    //             const errors = [
    //                 {
    //                     type: "field",
    //                     msg: "Acceso denegado: API_KEY inválida",
    //                     value: `${url}`,
    //                     path: "clave",
    //                     location: "params",
    //                 },
    //             ];
    //             throw new KeepFormatError(errors, 403);
    //         }

    //         return keyArray[0];
            
    //     } catch (err) {
    //         throw err;
    //     }
    // }

}

export default Services;