import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import bcrypt from "bcrypt";
import KeepFormatError from "../utils/KeepFormatErrors";

class User {
    static dependencies = ["tipos"];
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
            console.error(`Error al inicializar la tabla ${this.nombreTabla}:`, err);
            throw err;
        }
    }


    // Crear un nuevo usuario
    static async create(email: string, nombre: string, apellido: string, contraseña: string, nombre_tipo: string): Promise<RowDataPacket> {
        const queryInsert = `INSERT INTO ${this.nombreTabla} (email, nombre, apellido, contraseña, nombre_tipo) VALUES (?, ?, ?, ?, ?)`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE email = ?`;
        const queryType = `SELECT * FROM tipos WHERE nombre = ?`
        try {

            const [type] = await db.execute<RowDataPacket[]>(queryType, [nombre_tipo]);

            if (!type[0]) {
                const errors = [{ type: "field", msg: "El tipo de usuario no existe", value: `${nombre_tipo}`, path: "nombre_tipo", location: "body" }]
                throw new KeepFormatError(errors, 404);
            }
            const [user] = await db.execute<RowDataPacket[]>(querySelect, [email]);
            if (user[0]) {
                const errors = [{ type: "field", msg: "El usuario que intenta crear ya existe", value: `${email}`, path: "email", location: "body" }]
                throw new KeepFormatError(errors, 409);
            }

            // Ejecuta la consulta de inserción
            const [result] = await db.execute<ResultSetHeader>(queryInsert, [email, nombre, apellido, contraseña, nombre_tipo]);


            // Ejecutamos la consulta para obtener los datos completos del usuario
            const [rows] = await db.execute<RowDataPacket[]>(querySelect, [email]);

            // Devolvemos el usuario creado
            return rows[0]; // Como es solo un usuario, devolvemos el primer (y único) elemento
        } catch (err) {
            throw err;
        }
    }

    // Login usuario
    static async login(email: string, contraseña: string): Promise<RowDataPacket> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE email = ?`;

        try {

            const [rows] = await db.execute<RowDataPacket[]>(querySelect, [email]);

            const user = rows[0];

            //Si no existe el usuario con el email especificado
            if (!user) {
                const errors = [{ type: "field", msg: "Usuario o contraseña incorrecta", value: `${email}`, path: "email", location: "body" }]
                throw new KeepFormatError(errors, 400);
            }

            const hashedPassword = user.contraseña;

            const isMatch = await bcrypt.compare(contraseña, hashedPassword);
            // Si la contraseña es verdadera isMatch toma el valor de true


            if (!isMatch) {
                const errors = [{ type: "field", msg: "Usuario o contraseña incorrecta", value: `${contraseña}`, path: "contraseña", location: "body" }]
                throw new KeepFormatError(errors, 400);
            }


            return rows[0];
        } catch (err) {
            throw err;
        }
    }

    // Obtener un usuario por ID
    static async getById(email: string): Promise<RowDataPacket> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE email = ?`;

        try {
            const [user] = await db.execute<RowDataPacket[]>(querySelect, [email]);
            if (!user[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Usuario no encontrado",
                        value: `${email}`,
                        path: "email",
                        location: "params",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            return user[0];
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

    // Actualizar completamente un usuario PUT
    static async update(
        email: string,
        nuevo_email: string,
        nombre: string,
        apellido: string,
        contraseña: string,
        nombre_tipo: string
    ): Promise<RowDataPacket> {
        const queryUpdate = `UPDATE ${this.nombreTabla} SET email = ?, nombre = ?, apellido = ?, contraseña = ?, nombre_tipo = ? WHERE email = ?`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE email = ?`;
        const queryType = `SELECT * FROM tipos WHERE nombre = ?`;
        try {

            const [existingType] = await db.execute<RowDataPacket[]>(
                queryType,
                [nombre_tipo]
            );
            if (!existingType[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "El tipo no existe",
                        value: nombre_tipo,
                        path: "nombre_tipo",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            // Se comprueba si el usuario ya existe
            const [existingUser] = await db.execute<RowDataPacket[]>(
                querySelect,
                [email]
            );
            if (!existingUser[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "El usuario que intenta actualizar no existe",
                        value: email,
                        path: "email",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }


            // Se comprueba si el nuevo_email pertenece a otro usuario
            const [existingOtherUser] = await db.execute<RowDataPacket[]>(
                querySelect,
                [nuevo_email]
            );


            if (existingOtherUser[0] && email !== nuevo_email) {
                const errors = [
                    {
                        type: "field",
                        msg: "El nuevo email pertenece a otro usuario",
                        value: nuevo_email,
                        path: "email",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 409);

            }

            // Ejecutar la consulta de actualización completa
            await db.execute<ResultSetHeader>(queryUpdate, [
                nuevo_email,
                nombre,
                apellido,
                contraseña,
                nombre_tipo,
                email
            ]);

            // Retornar al usuario actualizado
            const [updatedUser] = await db.execute<RowDataPacket[]>(querySelect, [
                nuevo_email,
            ]);

            return updatedUser[0];
        } catch (err) {

            throw err;
        }
    }

    // Eliminar un usuario
    static async delete(email: string): Promise<RowDataPacket> {
        const queryDelete = `DELETE FROM ${this.nombreTabla} WHERE email = ?`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE email = ?`
        try {
            const [user] = await db.execute<RowDataPacket[]>(querySelect, [email]);
            const userDelete = user[0];

            if (!user[0]) {
                const errors = [{ type: "field", msg: "Usuario no encontrado", value: `${email}`, path: "email", location: "params" }]
                throw new KeepFormatError(errors, 404);
            }

            await db.execute<RowDataPacket[]>(queryDelete, [email]);


            return userDelete;
        } catch (err) {
            throw err;
        }
    }

    // Actualizar parcialmente un usuario PATCH
    static async partialUpdate(
        email: string,
        fieldsToUpdate: Partial<{ nuevo_email: string, nombre: string; apellido: string; contraseña: string; nombre_tipo: string }>
    ): Promise<RowDataPacket> {
        let queryUpdate = `UPDATE ${this.nombreTabla} SET `;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE email = ?`;
        const queryType = `SELECT * FROM tipos WHERE nombre = ?`;

        const fields = [];
        const values = [];

        // Construimos dinámicamente la consulta solo con los campos proporcionados
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            if (key === "nuevo_email" && value !== undefined && value !== null) {
                fields.push(`email = ?`);
                values.push(value);
                continue;
            }
            if (value !== undefined && value !== null) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        // Si no hay campos para actualizar, lanzamos un error
        if (fields.length === 0) {
            const errors = [{ type: "field", msg: "No hay campos para actualizar", value: email, path: "email", location: "body" }];
            throw new KeepFormatError(errors, 400);
        }

        queryUpdate += fields.join(", ") + ` WHERE email = ?`;
        values.push(email);

        try {
            // Se comprueba si el usuario ya existe
            const [existingUser] = await db.execute<RowDataPacket[]>(querySelect, [email]);
            if (!existingUser[0]) {
                const errors = [{ type: "field", msg: "El usuario que intenta actualizar no existe", value: email, path: "email", location: "body" }];
                throw new KeepFormatError(errors, 404);
            }

            // Si se pasa un nuevo email, comprobar si pertenece a otro usuario
            const newEmail = fieldsToUpdate.nuevo_email;
            if (newEmail) {
                const [existingOtherUser] = await db.execute<RowDataPacket[]>(querySelect, [newEmail]);
                if (existingOtherUser[0] && email !== newEmail) {
                    const errors = [
                        {
                            type: "field",
                            msg: "El nuevo email pertenece a otro usuario",
                            value: newEmail,
                            path: "nuevo_email",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 409);
                }
            }

            // Si se pasa el tipo de usuario, verificar si el tipo existe
            const nombre_tipo = fieldsToUpdate.nombre_tipo;
            if (nombre_tipo) {
                const [existingType] = await db.execute<RowDataPacket[]>(queryType, [nombre_tipo]);
                if (!existingType[0]) {
                    const errors = [
                        {
                            type: "field",
                            msg: "El tipo de usuario no existe",
                            value: nombre_tipo,
                            path: "nombre_tipo",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 404);
                }
            }

            // Ejecutar la consulta de actualización parcial
            await db.execute<ResultSetHeader>(queryUpdate, values);

            // Si se actualiza el email, usar el nuevo para la selección
            const queryEmail = newEmail ? newEmail : email;

            // Retornar al usuario actualizado
            const [updatedUser] = await db.execute<RowDataPacket[]>(querySelect, [queryEmail]);
            return updatedUser[0];
        } catch (err) {
            throw err;
        }
    }

}

export default User;