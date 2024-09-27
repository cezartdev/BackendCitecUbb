import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import bcrypt from "bcrypt";
import KeepFormatError from "../utils/KeepFormatErrors";

class User {

    private static nombreTabla: string = "usuarios";

    //Modelo SQL de la clase
    static async initTable(): Promise<void> {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.nombreTabla} (
                email VARCHAR(200) PRIMARY KEY,
                nombre VARCHAR(50) NOT NULL,
                apellido VARCHAR(50) NOT NULL,
                contraseña VARCHAR(250) NOT NULL,
                nombre_tipo VARCHAR(30) NOT NULL,
                FOREIGN KEY (nombre_tipo) REFERENCES tipos(nombre),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Lista de usuarios para el Inicio de sesion';
        `;
        
        const saltRounds = 10;
        const passwordDefaultAdmin = "1234";
        const passwordDefaultUser = "1234";
        // Genera el hash de la contraseña
        const hashedAdminPassword = await bcrypt.hash(passwordDefaultAdmin, saltRounds);
        const hashedUserPassword = await bcrypt.hash(passwordDefaultUser, saltRounds);

        const insertDataQuery = `
            INSERT INTO ${this.nombreTabla} (email, nombre, apellido,contraseña,nombre_tipo) VALUES
            ('admin@gmail.com', 'admin', 'admin','${hashedAdminPassword}','admin'),
            ('user@gmail.com', 'UserFirstName' ,'UserLastName', '${hashedUserPassword}', 'usuario')
            ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);
        `;

        try {
            // Crear la tabla si no existe
            await db.query(createTableQuery);
            // Insertar valores por defecto si es necesario
            await db.query(insertDataQuery);
        } catch (err) {
            console.error('Error al inicializar la tabla usuarios:', err);
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

    // Login usuario
    static async login( email: string, contraseña: string): Promise<RowDataPacket> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE email = ?`;
        
        try {
            
            const [rows] = await db.execute<RowDataPacket[]>(querySelect, [email]);

            const user = rows[0];
            
            //Si no existe el usuario con el email especificado
            if(!user){
                const errors = [{type:"field",msg:"Usuario o contraseña incorrecta",value:`${email}`, path:"email",location:"body"}]
                throw new KeepFormatError(errors);
            }

            const hashedPassword = user.contraseña;
            
            const isMatch = await bcrypt.compare(contraseña,hashedPassword);
            // Si la contraseña es verdadera isMatch toma el valor de true
            

            if(!isMatch){
                const errors = [{type:"field",msg:"Usuario o contraseña incorrecta",value:`${contraseña}`, path:"contraseña",location:"body"}]
                throw new KeepFormatError(errors);
            }
            
            
            return rows[0]; 
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

export default User;