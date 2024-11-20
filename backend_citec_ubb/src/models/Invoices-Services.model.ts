import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import KeepFormatError from "../utils/KeepFormatErrors";
class InvoicesServices {
    //Modelo SQL de la clase
    static dependencies = ["servicios", "cotizaciones"];
    private static nombreTabla: string = "cotizaciones_servicios";

    static async initTable(): Promise<void> {
       
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.nombreTabla} (
                numero_folio INT NOT NULL COMMENT 'numero de la factura',
                nombre VARCHAR(200) NOT NULL COMMENT 'nombre del servicio',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (numero_folio) REFERENCES cotizaciones(numero_folio),
                FOREIGN KEY (nombre) REFERENCES servicios(nombre),
                PRIMARY KEY (numero_folio, nombre)

            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Tabla intemedia para servicios y cotizaciones';
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

export default InvoicesServices;