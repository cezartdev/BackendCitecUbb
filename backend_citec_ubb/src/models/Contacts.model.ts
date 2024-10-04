import db from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import KeepFormatError from "../utils/KeepFormatErrors";

class Contacts {
    //Modelo SQL de la clase
    static dependencies = ["empresas"];
    private static nombreTabla: string = "contactos";

    static async initTable(): Promise<void> {

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.nombreTabla} (
                email varchar(200) NOT NULL PRIMARY KEY COMMENT 'Email de contacto',
                nombre varchar(64) COLLATE latin1_spanish_ci NOT NULL COMMENT 'Nombre extenso',
                cargo varchar(100) COLLATE latin1_spanish_ci NOT NULL COMMENT 'cargo en la empresa',
                rut_empresa varchar(200) NOT NULL COMMENT 'Rut de la empresa',
                FOREIGN KEY (rut_empresa) REFERENCES empresas(rut),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Lista de contactos de empresas';
        `;
        const insertDataQuery = `
            INSERT INTO ${this.nombreTabla} (email,nombre,cargo,rut_empresa) VALUES 
            (fji9okp1qg@mail.com, Maria Garcia , Director de Marketing, 84.976.200-1)
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
                        msg: "No existen contactos",
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
    static async getById(email: string): Promise<RowDataPacket> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE id = ?`;

        try {
            const [contacts] = await db.execute<RowDataPacket[]>(querySelect, [email]);
            if (!contacts[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "contacto no encontrado",
                        value: `${email}`,
                        path: "id",
                        location: "params",
                    },
                ];
                throw new KeepFormatError(errors);
            }
            return contacts[0];
        } catch (err) {
            throw err;
        }
    }
}

export default Contacts;