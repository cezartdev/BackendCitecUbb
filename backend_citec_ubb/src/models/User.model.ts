import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

class User {
    //Modelo SQL de la clase
    static async initTable(): Promise<void> {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS usuarios (
                email VARCHAR(200) PRIMARY KEY,
                nombre VARCHAR(50) NOT NULL,
                apellido VARCHAR(50) NOT NULL,
                contraseña VARCHAR(250) NOT NULL,
                nombre_tipo VARCHAR(30) NOT NULL,
                FOREIGN KEY (nombre_tipo) REFERENCES tipos(nombre),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        const insertDataQuery = `
            INSERT INTO usuarios (email, nombre, apellido,contraseña,nombre_tipo) VALUES
            ('admin@gmail.com', 'admin', 'admin','1234','admin'),
            ('user@gmail.com', 'UserFirstName' ,'UserLastName', '1234', 'usuario')
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
    static async create( email: string, nombre: string, apellido: string, contraseña: string, tipo: string): Promise<RowDataPacket> {
        const queryInsert = 'INSERT INTO usuarios (email, nombre, apellido, contraseña, tipo) VALUES (?, ?, ?, ?, ?)';
        const querySelect = 'SELECT * FROM usuarios WHERE email = ?';
        
        try {
            // Ejecuta la consulta de inserción
            const [result] = await db.execute<ResultSetHeader>(queryInsert, [email, nombre, apellido, contraseña,tipo]);

            console.log(result);
            // Obtenemos el id del usuario recién creado
            const insertId = result.insertId;

            // Ejecutamos la consulta para obtener los datos completos del usuario
            const [rows] = await db.execute<RowDataPacket[]>(querySelect, [insertId]);

            // Devolvemos el usuario creado
            return rows[0]; // Como es solo un usuario, devolvemos el primer (y único) elemento
        } catch (err) {
            throw err;
        }
    }

    // Login usuario
    static async login( email: string, contraseña: string): Promise<RowDataPacket> {
        const querySelect = 'SELECT * FROM usuarios WHERE email = ?';
        
        try {
           
            const [rows] = await db.execute<RowDataPacket[]>(querySelect, [email]);

            const user = rows[0];



            /* devolver esto
                {
                    "login": true,
                   "usuario":{
                        datos del usuario
                   }
                
                }
            */

           
            return rows[0]; 
        } catch (err) {
            throw err;
        }
    }


    // Obtener todos los usuarios


    // Obtener un usuario por ID


    // Actualizar un usuario


    // Eliminar un usuario

}

export default User;