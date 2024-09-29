import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import KeepFormatError from "../utils/KeepFormatErrors";

class Business {
    static dependencies = ["contactos", "regiones","provincias","comunas","cotizaciones","giros_empresas"];
    private static nombreTabla: string = "empresas";

    //Modelo SQL de la clase
    static async initTable(): Promise<void> {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.nombreTabla} (
                rut VARCHAR(200) PRIMARY KEY,
                razon_social VARCHAR(50) NOT NULL,
                nombre_de_fantasia VARCHAR(200) NOT NULL,
                email_factura VARCHAR(200) NOT NULL,
                direccion VARCHAR(250) NOT NULL,
                region INT NOT NULL,
                provincia INT NOT NULL,
                comuna INT NOT NULL,
                telefono VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (region) REFERENCES regiones(id),
                FOREIGN KEY (provincia) REFERENCES provincias(id),
                FOREIGN KEY (comuna) REFERENCES comunas(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Lista de usuarios para el Inicio de sesion';
        `;
     
        const insertDataQuery = `
            INSERT INTO ${this.nombreTabla} (rut,razon_social,nombre_de_fantasia,email_factura,direccion,region,provincia,comuna,telefono) VALUES
            ('84.976.200-1', 'Cerámicas Santiago S.A.', 'Cerámicas Santiago S.A.','frios@ceramicasantiago.cl','Avda Italia 1000','15','11','1101','+56912345678')
            ON DUPLICATE KEY UPDATE rut = VALUES(rut);
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


    // Crear un nuevo usuario
    static async create( email: string, nombre: string, apellido: string, contraseña: string, nombre_tipo: string): Promise<RowDataPacket> {
        const queryInsert = `INSERT INTO ${this.nombreTabla} (email, nombre, apellido, contraseña, nombre_tipo) VALUES (?, ?, ?, ?, ?)`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE email = ?`;
        const queryType = `SELECT * FROM tipos WHERE nombre = ?`
        try {

            //TODO: Falta crear la validacion del tipo
            const [type] = await db.execute<ResultSetHeader>(queryType, [nombre_tipo]);

            if(!type[0]){
                const errors = [{type:"field",msg:"Error al crear usuario",value:`${nombre_tipo}`, path:"nombre_tipo",location:"body"}]
                throw new KeepFormatError(errors);
            }
            // Ejecuta la consulta de inserción
            const [result] = await db.execute<ResultSetHeader>(queryInsert, [email, nombre, apellido, contraseña,nombre_tipo]);


            // Ejecutamos la consulta para obtener los datos completos del usuario
            const [rows] = await db.execute<RowDataPacket[]>(querySelect, [email]);

            // Devolvemos el usuario creado
            return rows[0]; // Como es solo un usuario, devolvemos el primer (y único) elemento
        } catch (err) {
            throw err;
        }
    }

   

    // Obtener todos los usuarios
    static async getAll(): Promise<RowDataPacket[]> {
        const querySelect = `SELECT * FROM ${this.nombreTabla}`;
        
        try {
            const [rows] = await db.execute<RowDataPacket[]>(querySelect);

            return rows;
        } catch (err) {
            throw err;
        }
    }

    // Obtener un usuario por ID


    // Actualizar un usuario


    // Eliminar un usuario
    static async delete(id: string): Promise<RowDataPacket> {
        const queryDelete = `DELETE FROM ${this.nombreTabla} WHERE email = ?`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE email = ?`
        try {
            const [user] = await db.execute<RowDataPacket[]>(querySelect, [id]);
            const userDelete = user[0];

            if(!user[0]){
                const errors = [{type:"field",msg:"Usuario no encontrado",value:`id`, path:"params",location:"url"}]
                throw new KeepFormatError(errors);
            }

            const [rows] = await db.execute<RowDataPacket[]>(queryDelete, [id]);


            return userDelete;
        } catch (err) {
            throw err;
        }
    }
}

export default Business;