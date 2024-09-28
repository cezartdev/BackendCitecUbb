import db from "../../config/db"
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import KeepFormatError from "../../utils/KeepFormatErrors";

class Province {
    //Modelo SQL de la clase
    private static nombreTabla: string = "provincias";

    static async initTable(): Promise<void> {
       
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.nombreTabla} (
                id_pr int(11) NOT NULL COMMENT 'ID provincia',
                id_re int(11) NOT NULL COMMENT 'ID region asociada',
                str_descripcion varchar(30) COLLATE latin1_spanish_ci NOT NULL COMMENT 'Nombre descriptivo',
                num_comunas int(11) NOT NULL COMMENT 'Numero de comunas',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id_pr)
            )   ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Lista de provincias de Chile';
        `;
        const insertDataQuery = `
            INSERT INTO ${this.nombreTabla} (id_pr, id_re, str_descripcion, num_comunas) VALUES
                (1,1,'ARICA',2),
				(2,1,'PARINACOTA',2),
				(3,2,'IQUIQUE',2),
				(4,2,'TAMARUGAL',5),
				(5,3,'ANTOFAGASTA',4),
				(6,3,'EL LOA',3),
				(7,3,'TOCOPILLA',2),
				(8,4,'COPIAPÓ',3),
				(9,4,'CHAÑARAL',2),
				(10,4,'HUASCO',4),
				(11,5,'ELQUI',6),
				(12,5,'CHOAPA',4),
				(13,5,'LIMARÍ',5),
				(14,6,'VALPARAÍSO',7),
				(15,6,'ISLA DE PASCUA',1),
				(16,6,'LOS ANDES',4),
				(17,6,'PETORCA',5),
				(18,6,'QUILLOTA',5),
				(19,6,'SAN ANTONIO',6),
				(20,6,'SAN FELIPE DE ACONCAGUA',6),
				(21,6,'MARGA MARGA',4),
				(22,7,'CACHAPOAL',17),
				(23,7,'CARDENAL CARO',6),
				(24,7,'COLCHAGUA',10),
				(25,8,'TALCA',10),
				(26,8,'CAUQUENES',3),
				(27,8,'CURICÓ',9),
				(28,8,'LINARES',8),
				(29,9,'CONCEPCIÓN',12),
				(30,9,'ARAUCO',7),
				(31,9,'BIOBÍO',14),
				(32,9,'ÑUBLE',21),
				(33,10,'CAUTÍN',21),
				(34,10,'MALLECO',11),
				(35,11,'VALDIVIA',8),
				(36,11,'RANCO',4),
				(37,12,'LLANQUIHUE',9),
				(38,12,'CHILOÉ',10),
				(39,12,'OSORNO',7),
				(40,12,'PALENA',4),
				(41,13,'COIHAIQUE',2),
				(42,13,'AISÉN',3),
				(43,13,'CAPITÁN PRAT',3),
				(44,13,'GENERAL CARRERA',2),
				(45,14,'MAGALLANES',4),
				(46,14,'ANTÁRTICA CHILENA',2),
				(47,14,'TIERRA DEL FUEGO',3),
				(48,14,'ULTIMA ESPERANZA',2),
				(49,15,'SANTIAGO',32),
				(50,15,'CORDILLERA',3),
				(51,15,'CHACABUCO',3),
				(52,15,'MAIPO',4),
				(53,15,'MELIPILLA',5),
				(54,15,'TALAGANTE',5)
                ON DUPLICATE KEY UPDATE str_descripcion = VALUES(str_descripcion);
        `;

        try {
            // Crear la tabla si no existe
            await db.query(createTableQuery);
            // Insertar valores por defecto si es necesario
            await db.query(insertDataQuery);
        } catch (err) {
            console.error('Error al inicializar la tabla provincias:', err);
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

export default Province;