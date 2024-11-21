import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import KeepFormatError from "../utils/KeepFormatErrors";
class Invoices {
    //Modelo SQL de la clase
    static dependencies = ["empresas", "servicios", "giros"];
    private static nombreTabla: string = "cotizaciones";

    static async initTable(): Promise<void> {
       
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.nombreTabla} (
                numero_folio INT NOT NULL AUTO_INCREMENT COMMENT 'numero de la factura',
                pago_neto DECIMAL(11,2) NOT NULL COMMENT 'pago sin iva',
                iva DECIMAL(11,2) DEFAULT 0 COMMENT 'iva de la cotización',
                fecha DATE NOT NULL,
                rut_emisor VARCHAR(200) NOT NULL,
                rut_receptor VARCHAR(200) NOT NULL,
                codigo_giro INT NOT NULL,
                imagen VARCHAR(200),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (numero_folio),
                FOREIGN KEY (rut_emisor) REFERENCES empresas(rut) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (rut_receptor) REFERENCES empresas(rut) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (codigo_giro) REFERENCES giros(codigo) ON DELETE CASCADE ON UPDATE CASCADE

            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Lista de cotizaciones';
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



    // Obtener por ID
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

export default Invoices;