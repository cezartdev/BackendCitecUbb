import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import KeepFormatError from "../utils/KeepFormatErrors";

class Province {
    //Modelo SQL de la clase
	static dependencies = ["regiones"];
    private static nombreTabla: string = "provincias";

    static async initTable(): Promise<void> {
       
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.nombreTabla} (
                id int NOT NULL COMMENT 'ID provincia',
				nombre varchar(30) COLLATE latin1_spanish_ci NOT NULL COMMENT 'Nombre de la region',
                region int NOT NULL COMMENT 'ID region asociada',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
				FOREIGN KEY (region) REFERENCES regiones(id)
            )   ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Lista de provincias de Chile';
        `;
        const insertDataQuery = `
            INSERT INTO ${this.nombreTabla} (id, nombre, region) VALUES
                (011,'Iquique',01),
				(014,'Tamarugal',01),
				(021,'Antofagasta',02),
				(022,'El Loa',02),
				(023,'Tocopilla',02),
				(031,'Copiapó',03),
				(032,'Chañaral',03),
				(033,'Huasco',03),
				(041,'Elqui',04),
				(042,'Choapa',04),
				(043,'Limarí',04),
				(051,'Valparaíso',05),
				(052,'Isla de Pascua',05),
				(053,'Los Andes',05),
				(054,'Petorca',05),
				(055,'Quillota',05),
				(056,'San Antonio',05),
				(057,'San Felipe de Aconcagua',05),
				(058,'Marga Marga',05),
				(061,'Cachapoal',06),
				(062,'Cardenal Caro',06),
				(063,'Colchagua',06),
				(071,'Talca',07),
				(072,'Cauquenes',07),
				(073,'Curicó',07),
				(074,'Linares',07),
				(081,'Concepción',08),
				(082,'Arauco',08),
				(083,'Biobío',08),
				(091,'Cautín',09),
				(092,'Malleco',09),
				(101,'Llanquihue',10),
				(102,'Chiloé',10),
				(103,'Osorno',10),
				(104,'Palena',10),
				(111,'Coihaique',11),
				(112,'Aisén',11),
				(113,'Capitán Prat',11),
				(114,'General Carrera',11),
				(121,'Magallanes',12),
				(122,'Antártica Chilena',12),
				(123,'Tierra del Fuego',12),
				(124,'Última Esperanza',12),
				(131,'Santiago',13),
				(132,'Cordillera',13),
				(133,'Chacabuco',13),
				(134,'Maipo',13),
				(135,'Melipilla',13),
				(136,'Talagante',13),
				(141,'Valdivia',14),
				(142,'Ranco',14),
				(151,'Arica',15),
				(152,'Parinacota',15),
				(161,'Diguillín',16),
				(162,'Itata',16),
				(163,'Punilla',16)
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
            const [rows] = await db.execute<RowDataPacket[]>(querySelect);

            return rows;
        } catch (err) {
            throw err;
        }
    }

    // Obtener por ID
    static async getById(id: string): Promise<RowDataPacket> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE id = ?`;

        try {
            const [province] = await db.execute<RowDataPacket[]>(querySelect,[id]);
			if (!province[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Provincia no encontrada",
                        value: `${id}`,
                        path: "id",
                        location: "params",
                    },
                ];
                throw new KeepFormatError(errors);
            }
            return province[0];
        } catch (err) {
            throw err;
        }
    }

    // Actualizar 
    

}

export default Province;