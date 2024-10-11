import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import KeepFormatError from "../utils/KeepFormatErrors";

class GiroEmpresa {
    static dependencies = ["giros", "empresas"];
    private static nombreTabla: string = "giros_empresa";

    //Modelo SQL de la clase
    static async initTable(): Promise<void> {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.nombreTabla} (
                rut_empresa VARCHAR(200) NOT NULL,
                codigo_giro INT NOT NULL,
                FOREIGN KEY (rut_empresa) REFERENCES empresas(rut),   
                FOREIGN KEY (codigo_giro) REFERENCES giros(codigo),             
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (rut_empresa, codigo_giro)
    )ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Lista de giros de empresas';
        `;

        //        const insertDataQuery = `
        //        INSERT INTO ${this.nombreTabla} (rut_empresa,codigo_giro) VALUES
        //     ('84.976.200-1', '239200')
        //       ON DUPLICATE KEY UPDATE rut_empresa = VALUES(rut_empresa);
        //   `;

        try {
            // Crear la tabla si no existe
            await db.query(createTableQuery);
            // Insertar valores por defecto si es necesario
            //         await db.query(insertDataQuery);

        } catch (err) {
            console.error('Error al inicializar la tabla giros_empresa:', err);
            throw err;
        }
    }

}

export default GiroEmpresa;