import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import KeepFormatError from "../utils/KeepFormatErrors";

class BussinessLine {
    //Modelo SQL de la clase
    static async initTable(): Promise<void> {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS giros (
                codigo INT PRIMARY KEY,
                nombre VARCHAR(200) NOT NULL,
                nombre_categorias VARCHAR(200) NOT NULL,
                FOREIGN KEY (nombre_categorias) REFERENCES categorias(nombre),                
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        const insertDataQuery = `
            INSERT INTO giros (codigo, nombre, nombre_categorias) VALUES
            ('239200', 'FABRICACION DE MATERIALES DE CONSTRUCCION DE ARCILLA', 'INDUSTRIA MANUFACTURERA'),
            ('410010', 'CONSTRUCCION DE EDIFICIOS PARA USO RESIDENCIAL', 'CONSTRUCCIÓN'),
            ('475201', 'VENTA AL POR MENOR DE ARTÍCULOS DE FERRETERÍA Y MATERIALES DE CONSTRUCCIÓN', 'COMERCIO AL POR MAYOR Y AL POR MENOR; REPARACIÓN DE VEHICULOS AUTOMOTORES Y MOTOCICLETAS'),
            ('162100', 'FABRICACIÓN DE HOJAS DE MADERA PARA ENCHAPADO Y TABLEROS A BASE DE MADERA', 'INDUSTRIA MANUFACTURERA'),
            ('162900', 'FABRICACIÓN DE OTROS PRODUCTOS DE MADERA, DE ARTÍCULOS DE CORCHO, PAJA Y MATERIALES TRENZABLES, 'INDUSTRIA MANUFACTURERA'),
            ('466302', 'VENTA AL POR MAYOR DE MATERIALES DE CONSTRUCCIÓN, ARTÍCULOS DE FERRETERÍA, GASFITERÍA Y CALEFACCIÓN', 'COMERCIO AL POR MAYOR Y AL POR MENOR; REPARACIÓN DE VEHICULOS AUTOMOTORES Y MOTOCICLETAS'),
            ('12900', 'CULTIVO DE OTRAS PLANTAS PERENNES', 'AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA'),
            ('22000', 'EXTRACCIÓN DE MADERA', 'AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA'),
            ('162200', 'FABRICACIÓN DE PARTES Y PIEZAS DE CARPINTERÍA PARA EDIFICIOS Y CONSTRUCCIONES', 'INDUSTRIA MANUFACTURERA'),
            ('201300', 'FABRICACIÓN DE PLÁSTICOS Y CAUCHO SINTÉTICO EN FORMAS PRIMARIAS','INDUSTRIA MANUFACTURERA'),
            ('231001', 'FABRICACIÓN DE VIDRIO PLANO', 'INDUSTRIA MANUFACTURERA'),
            ('239900', 'FABRICACIÓN DE OTROS PRODUCTOS MINERALES NO METÁLICOS N.C.P.', 'INDUSTRIA MANUFACTURERA'),
            ('242002', 'FABRICACIÓN DE PRODUCTOS PRIMARIOS DE ALUMINIO', 'INDUSTRIA MANUFACTURERA'),
            ('251100', 'FABRICACIÓN DE PRODUCTOS METÁLICOS PARA USO ESTRUCTURAL', 'INDUSTRIA MANUFACTURERA'),
            ('259900', 'FABRICACIÓN DE OTROS PRODUCTOS ELABORADOS DE METAL N.C.P.', 'INDUSTRIA MANUFACTURERA'),
            ('351011', 'GENERACIÓN DE ENERGÍA ELÉCTRICA EN CENTRALES HIDROELÉCTRICAS', 'SUMINISTRO DE ELECTRICIDAD, GAS, VAPOR Y AIRE ACONDICIONADO'),
            ('421000', 'CONSTRUCCIÓN DE CARRETERAS Y LÍNEAS DE FERROCARRIL', 'CONSTRUCCIÓN'),
            ('429000', 'CONSTRUCCIÓN DE OTRAS OBRAS DE INGENIERÍA CIVIL', 'CONSTRUCCIÓN'),
            ('431200', 'PREPARACIÓN DEL TERRENO', 'CONSTRUCCIÓN'),
            ('433000', 'TERMINACIÓN Y ACABADO DE EDIFICIOS', 'CONSTRUCCIÓN'),
            ('439000', 'OTRAS ACTIVIDADES ESPECIALIZADAS DE CONSTRUCCIÓN', 'CONSTRUCCIÓN'),
            ('466301', 'VENTA AL POR MAYOR DE MADERA EN BRUTO Y PRODUCTOS PRIMARIOS DE LA ELABORACIÓN DE MADERA', 'COMERCIO AL POR MAYOR Y AL POR MENOR; REPARACIÓN DE VEHICULOS AUTOMOTORES Y MOTOCICLETAS'),
            ('475203', 'VENTA AL POR MENOR DE PRODUCTOS DE VIDRIO EN COMERCIOS ESPECIALIZADOS', 'COMERCIO AL POR MAYOR Y AL POR MENOR; REPARACIÓN DE VEHICULOS AUTOMOTORES Y MOTOCICLETAS'),
            ('231009', 'FABRICACIÓN DE PRODUCTOS DE VIDRIO N.C.P.', 'INDUSTRIA MANUFACTURERA')

            ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);
        `;

        try {
            // Crear la tabla si no existe
            await db.query(createTableQuery);
            // Insertar valores por defecto si es necesario
            await db.query(insertDataQuery);
        } catch (err) {
            console.error('Error al inicializar la tabla giros:', err);
            throw err;
        }
    }

    // Crear
    static async create(nombre: string): Promise<RowDataPacket> {
        const queryInsert = 'INSERT INTO giros (nombre) VALUES (?)';
        const querySelect = 'SELECT * FROM giros WHERE nombre = ?';

        try {
            // Ejecuta la consulta de inserción
            const [result] = await db.execute<ResultSetHeader>(queryInsert, [nombre]);

            console.log(result);

            const insertId = result.insertId;

            // Ejecutamos la consulta para obtener los datos completos del usuario
            const [rows] = await db.execute<RowDataPacket[]>(querySelect, [insertId]);

            // Devolvemos
            return rows[0];
        } catch (err) {
            throw err;
        }
    }

    static async getAll(): Promise<RowDataPacket[]> {
        const querySelect = 'SELECT * FROM giros';

        try {
            const [rows] = await db.execute<RowDataPacket[]>(querySelect);


            // Devolvemos
            return rows;
        } catch (err) {
            throw err;
        }
    }
}

export default BussinessLine;