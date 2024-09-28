import db from "../../config/db"
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import KeepFormatError from "../../utils/KeepFormatErrors";

class Region {
    //Modelo SQL de la clase
    private static nombreTabla: string = "regiones";

    static async initTable(): Promise<void> {
       
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.nombreTabla} (
                id_re int(11) NOT NULL COMMENT 'ID unico',
                str_descripcion varchar(60) COLLATE latin1_spanish_ci NOT NULL COMMENT 'Nombre extenso',
                str_romano varchar(5) COLLATE latin1_spanish_ci NOT NULL COMMENT 'Número de región',
                num_provincias int(11) NOT NULL COMMENT 'total provincias',
                num_comunas int(11) NOT NULL COMMENT 'Total de comunas',
                PRIMARY KEY (id_re)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Lista de regiones de Chile';
        `;
        const insertDataQuery = `
            INSERT INTO ${this.nombreTabla} VALUES 
                (1,'ARICA Y PARINACOTA','XV',2,4),
				(2,'TARAPACÁ','I',2,7),
				(3,'ANTOFAGASTA','II',3,9),
				(4,'ATACAMA','III',3,9),
				(5,'COQUIMBO','IV',3,15),
				(6,'VALPARAÍSO','V',8,38),
				(7,"DEL LIBERTADOR GRAL. BERNARDO O'HIGGINS",'VI',3,33),
				(8,'DEL MAULE','VII',4,30),
				(9,'DEL BIOBÍO','VIII',4,54),
				(10,'DE LA ARAUCANÍA','IX',2,32),
				(11,'DE LOS RÍOS','XIV',2,12),
				(12,'DE LOS LAGOS','X',4,30),
				(13,'AISÉN DEL GRAL. CARLOS IBAÑEZ DEL CAMPO ','XI',4,10),
				(14,'MAGALLANES Y DE LA ANTÁRTICA CHILENA','XII',4,11),
				(15,'METROPOLITANA DE SANTIAGO','RM',6,52)
                ON DUPLICATE KEY UPDATE str_descripcion = VALUES(str_descripcion);
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
    static async getById(id: string): Promise<RowDataPacket> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE id_re = ?`;

        try {
            const [rows] = await db.execute<RowDataPacket[]>(querySelect,[id]);

            return rows[0];
        } catch (err) {
            throw err;
        }
    }

    // Actualizar 
    

}

export default Region;