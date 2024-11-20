import db from "../config/db"
import bcrypt from "bcrypt";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import KeepFormatError from "../utils/KeepFormatErrors";
class ApiKey {
    //Modelo SQL de la clase
    static dependencies = [];
    private static nombreTabla: string = "api_keys";

    static async initTable(): Promise<void> {
       
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.nombreTabla} (
                url VARCHAR(100) NOT NULL COMMENT 'url del sitio web',
                clave VARCHAR(250) NOT NULL COMMENT 'clave api key',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (url)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Lista de claves';
        `;

        

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(process.env.API_KEY, saltRounds);
        const insertDataQuery = `
            INSERT INTO ${this.nombreTabla} (url, clave) VALUES 
                ('${process.env.FRONTEND_URL}','${hashedPassword}')
                ON DUPLICATE KEY UPDATE clave = VALUES(clave);
        `;

        try {
            if(!process.env.FRONTEND_URL){
                throw Error("NO FRONTEND_URL");
            }
            // Crear la tabla si no existe
            await db.query(createTableQuery);
            // Insertar valores por defecto si es necesario
            await db.query(insertDataQuery);
        } catch (err) {
            console.error(`Error al inicializar la tabla ${this.nombreTabla}:`, err);
            throw err;
        }
    }



    // Obtener por ID
    static async getById(url: string): Promise<RowDataPacket> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE url = ?`;
        
        try {

            const [keyArray] = await db.execute<RowDataPacket[]>(querySelect, [url]);
            if (!keyArray[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Acceso denegado: API_KEY inválida",
                        value: `${url}`,
                        path: "clave",
                        location: "params",
                    },
                ];
                throw new KeepFormatError(errors, 403);
            }

            return keyArray[0];
            
        } catch (err) {
            throw err;
        }
    }

}

export default ApiKey;