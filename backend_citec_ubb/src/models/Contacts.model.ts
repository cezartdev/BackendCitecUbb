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
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Lista de contactos de empresas';
        `;
        const insertDataQuery = `
            INSERT INTO ${this.nombreTabla} (email,nombre,cargo,rut_empresa) VALUES 
            ('fji9okp1qg@mail.com', 'Maria Garcia' , 'Director de Marketing','84.976.200-1')
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

    // Crear
    static async create(
        email: string,
        nombre: string,
        cargo: string,
        rut_empresa: string
    ): Promise<RowDataPacket> {
        const queryInsert = `INSERT INTO ${this.nombreTabla} (email,nombre,cargo,rut_empresa) VALUES (?, ?, ?, ?)`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE email = ?`;
        const queryBusiness = `SELECT * FROM empresas WHERE rut = ?`;
        try {
            //Se comprueba si la empresa existe
            const [business] = await db.execute<RowDataPacket[]>(queryBusiness, [
                rut_empresa,
            ]);
            if (!business[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Empresa no encontrada",
                        value: `${business}`,
                        path: "empresa",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }
            //Se comprueba si el contacto ya existe
            const [queryContacts] = await db.execute<RowDataPacket[]>(querySelect, [
                email,
            ]);
            if (queryContacts[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "El contacto que intentas crear ya existe",
                        value: `${email}`,
                        path: "email",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 409);
            }
            // Ejecuta la consulta de inserción
            await db.execute<ResultSetHeader>(queryInsert, [
                email,
                nombre,
                cargo,
                rut_empresa,
            ]);

            const [contact] = await db.execute<RowDataPacket[]>(querySelect, [email]);

            // Devolvemos el contaco creado
            return contact[0]; // Como es solo un contacto, devolvemos el primer (y único) elemento
        } catch (err) {
            throw err;
        }
    }

    // Actualizar completamente un contacto PUT
    static async update(
        email: string,
        nuevo_email: string,
        nombre: string,
        cargo: string,
        rut_empresa: string
    ): Promise<RowDataPacket> {
        const queryUpdate = `UPDATE ${this.nombreTabla} SET email = ?, nombre = ?, cargo = ?, rut_empresa = ? WHERE email = ?`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE email = ?`;
        const queryBusiness = `SELECT * FROM empresas WHERE rut = ?`;
        try {
            // Se comprueba si el contacto ya existe
            const [existingContact] = await db.execute<RowDataPacket[]>(
                querySelect,
                [email]
            );
            if (!existingContact[0]) {
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

            //Se comprueba si la empresa existe
            const [business] = await db.execute<RowDataPacket[]>(queryBusiness, [
                rut_empresa,
            ]);
            if (!business[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Empresa no encontrada",
                        value: `${rut_empresa}`,
                        path: "rut_empresa",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            // Se comprueba si el nuevo_email pertenece a otro contacto
            const [existingOtherContact] = await db.execute<RowDataPacket[]>(
                querySelect,
                [nuevo_email]
            );


            if (existingOtherContact[0] && email !== nuevo_email) {
                const errors = [
                    {
                        type: "field",
                        msg: "El nuevo rut pertenece a otra empresa",
                        value: nuevo_email,
                        path: "nuevo_email",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 409);

            }

            // Ejecutar la consulta de actualización completa
            await db.execute<ResultSetHeader>(queryUpdate, [
                nuevo_email,
                nombre,
                cargo,
                rut_empresa,
            ]);

            // Retornar al contacto actualizada
            const [updatedContact] = await db.execute<RowDataPacket[]>(querySelect, [
                nuevo_email,
            ]);

            return updatedContact[0];
        } catch (err) {

            throw err;
        }
    }

    // Actualizar parcialmente un contacto PATCH
    static async partialUpdate(
        email: string,
        fieldsToUpdate: Partial<{ nuevo_email: string, nombre: string; cargo: string; rut_empresa: string; }>
    ): Promise<RowDataPacket> {
        let queryUpdate = `UPDATE ${this.nombreTabla} SET `;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE email = ?`;
        const queryBusiness = `SELECT * FROM empresas WHERE rut = ?`;

        const fields = [];
        const values = [];

        // Construimos dinámicamente la consulta solo con los campos proporcionados
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            if (key === "nuevo_email" && value !== undefined && value !== null) {
                fields.push(`email = ?`);
                values.push(value);
                continue
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
            // Se comprueba si el contacto ya existe
            const [existingContact] = await db.execute<RowDataPacket[]>(querySelect, [email]);
            if (!existingContact[0]) {
                const errors = [{ type: "field", msg: "El contacto que intenta actualizar no existe", value: email, path: "email", location: "body" }];
                throw new KeepFormatError(errors, 404);
            }

            const newEmailContact = Object.entries(fieldsToUpdate)[0][1];
            if (newEmailContact) {
                const [existingOtherContact] = await db.execute<RowDataPacket[]>(
                    querySelect,
                    [newEmailContact]
                );

                if (existingOtherContact[0] && email !== newEmailContact) {
                    const errors = [
                        {
                            type: "field",
                            msg: "El nuevo email le pertenece a otro contacto",
                            value: newEmailContact,
                            path: "nuevo_email",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 409);

                }
            }

            //Si se pasa por parametro empresa se verifica que exista
            const newBusiness = Object.entries(fieldsToUpdate)[5][1];
            if (newBusiness) {
                const [business] = await db.execute<RowDataPacket[]>(queryBusiness, [newBusiness]);
                if (!business[0]) {
                    const errors = [
                        {
                            type: "field",
                            msg: "Empresa no encontrada",
                            value: `${newBusiness}`,
                            path: "empresa",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 404);
                }

            }

            // Ejecutar la consulta de actualización parcial
            await db.execute<ResultSetHeader>(queryUpdate, values);
            // Si existe un email nuevo se cambia
            const newEmail = Object.entries(fieldsToUpdate)[0][1];
            let queryEmail = email;
            if (newEmail) {
                queryEmail = newEmail;
            }
            // Retornar al contacto actualizado
            const [updatedContact] = await db.execute<RowDataPacket[]>(querySelect, [queryEmail]);
            return updatedContact[0];
        } catch (err) {
            throw err;
        }
    }

    // Eliminar
    static async delete(email: string): Promise<RowDataPacket> {
        const queryDelete = `DELETE FROM ${this.nombreTabla} WHERE email = ?`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE email = ?`;
        try {
            const [contact] = await db.execute<RowDataPacket[]>(querySelect, [email]);
            if (!contact[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "El usuario que intenta eliminar no existe",
                        value: `${email}`,
                        path: `email`,
                        location: "params",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            await db.execute<ResultSetHeader>(queryDelete, [email]);

            return contact[0];
        } catch (err) {
            throw err;
        }
    }
}

export default Contacts;