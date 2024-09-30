import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import KeepFormatError from "../utils/KeepFormatErrors";

class Region {
    //Modelo SQL de la clase
    static dependencies = [];
    private static nombreTabla: string = "regiones";

    static async initTable(): Promise<void> {
       
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.nombreTabla} (
                id int NOT NULL COMMENT 'ID unico',
                nombre varchar(64) COLLATE latin1_spanish_ci NOT NULL COMMENT 'Nombre extenso',
                ordinal varchar(5) COLLATE latin1_spanish_ci NOT NULL COMMENT 'Número de región',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Lista de regiones de Chile';
        `;
        const insertDataQuery = `
            INSERT INTO ${this.nombreTabla} (id,nombre,ordinal) VALUES 
                (1,'Tarapacá','I'),	
                (2,'Antofagasta','II'),	
                (3,'Atacama','III'),	
                (4,'Coquimbo','IV'),	
                (5,'Valparaiso','V'),	
                (6,"Libertador General Bernardo O'Higgins",'VI'),	
                (7,'Maule','VII'),
                (8,'Biobío','VIII'),	
                (9,'La Araucanía','IX'),	
                (10,'Los Lagos','X'),	
                (11,'Aisén del General Carlos Ibáñez del Campo','XI'),	
                (12,'Magallanes y de la Antártica Chilena','XII'),
                (13,'Metropolitana de Santiago','RM'),	
                (14,'Los Ríos','XIV'),	
                (15,'Arica y Parinacota','XV'),	
                (16,'Ñuble','XVI')
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

    // Obtener todos 
    static async getAll(): Promise<RowDataPacket[]> {
        const querySelect = `SELECT * FROM ${this.nombreTabla}`;

        try {
            const [region] = await db.execute<RowDataPacket[]>(querySelect);
            if (!region[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "No existen regiones",
                        value: ``,
                        path: "",
                        location: "",
                    },
                ];
                throw new KeepFormatError(errors);
            }
            return region;
        } catch (err) {
            throw err;
        }
    }

    // Obtener por ID
    static async getById(id: string): Promise<RowDataPacket> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE id = ?`;

        try {
            const [region] = await db.execute<RowDataPacket[]>(querySelect,[id]);
            if (!region[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Region no encontrada",
                        value: `${id}`,
                        path: "id",
                        location: "params",
                    },
                ];
                throw new KeepFormatError(errors);
            }
            return region[0];
        } catch (err) {
            throw err;
        }
    }
}

export default Region;