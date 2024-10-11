import db from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import KeepFormatError from "../utils/KeepFormatErrors";

class Business {
    static dependencies = ["comunas"];
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
                comuna INT NOT NULL,
                telefono VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (comuna) REFERENCES comunas(id)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Lista de empresas o clientes';
        `;

        const insertDataQuery = `
            INSERT INTO ${this.nombreTabla} (rut,razon_social,nombre_de_fantasia,email_factura,direccion,comuna,telefono) VALUES
            ('84.976.200-1', 'Cerámicas Santiago S.A.', 'Cerámicas Santiago S.A.','frios@ceramicasantiago.cl','Avda Italia 1000','1101','+56912345678')
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

    // Crear
    static async create(
        rut: string,
        razonSocial: string,
        nombreDeFantasia: string,
        emailFactura: string,
        direccion: string,
        comuna: string,
        telefono: string
    ): Promise<RowDataPacket> {
        const queryInsert = `INSERT INTO ${this.nombreTabla} (rut, razon_social, nombre_de_fantasia, email_factura, direccion, comuna, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE rut = ?`;
        const queryCommune = `SELECT * FROM comunas WHERE id = ?`;
        try {
            //Se comprueba si la comuna existe
            const [commune] = await db.execute<RowDataPacket[]>(queryCommune, [
                comuna,
            ]);
            if (!commune[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Comuna no encontrada",
                        value: `${comuna}`,
                        path: "comuna",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }
            //Se comprueba si la empresa ya existe
            const [queryBusiness] = await db.execute<RowDataPacket[]>(querySelect, [
                rut,
            ]);
            if (queryBusiness[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "La empresa que intenta crear ya existe",
                        value: `${rut}`,
                        path: "rut",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 409);
            }
            // Ejecuta la consulta de inserción
            await db.execute<ResultSetHeader>(queryInsert, [
                rut,
                razonSocial,
                nombreDeFantasia,
                emailFactura,
                direccion,
                comuna,
                telefono,
            ]);

            const [business] = await db.execute<RowDataPacket[]>(querySelect, [rut]);

            // Devolvemos el usuario creado
            return business[0]; // Como es solo un usuario, devolvemos el primer (y único) elemento
        } catch (err) {
            throw err;
        }
    }

    // Obtener todos
    static async getAll(): Promise<RowDataPacket[]> {
        const querySelect = `SELECT * FROM ${this.nombreTabla}`;
        const queryBusinessLine = `SELECT giros_empresa.codigo_giro,giros.nombre FROM ${this.nombreTabla} INNER JOIN giros_empresa ON giros_empresa.rut_empresa = ${this.nombreTabla}.rut INNER JOIN giros ON codigo_giro = giros.codigo WHERE rut = ?`
        const queryCommune = `SELECT comunas.id,comunas.nombre FROM ${this.nombreTabla} JOIN comunas ON ${this.nombreTabla}.comuna = comunas.id WHERE rut = ?`
        try {
            const [business] = await db.execute<RowDataPacket[]>(querySelect);


            for (const value of business) {
                const [businessLine] = await db.execute<RowDataPacket[]>(queryBusinessLine, [value.rut]);
                const [businessCommune] = await db.execute<RowDataPacket[]>(queryCommune, [value.rut]);
                // Añadir el resultado de businessLine a cada objeto
                value.giros = businessLine;
                value.comuna = businessCommune[0];
            }


            return business;
        } catch (err) {
            throw err;
        }
    }

    // Obtener por ID
    static async getById(rut: string): Promise<RowDataPacket> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE rut = ?`;
        const queryBusinessLine = `SELECT giros_empresa.codigo_giro,giros.nombre FROM ${this.nombreTabla} INNER JOIN giros_empresa ON giros_empresa.rut_empresa = ${this.nombreTabla}.rut INNER JOIN giros ON codigo_giro = giros.codigo WHERE rut = ?`
        const queryCommune = `SELECT comunas.id,comunas.nombre FROM ${this.nombreTabla} JOIN comunas ON ${this.nombreTabla}.comuna = comunas.id WHERE rut = ?`
        try {
            const [business] = await db.execute<RowDataPacket[]>(querySelect, [rut]);
            if (!business[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Empresa no encontrada",
                        value: `${rut}`,
                        path: "rut",
                        location: "params",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }
            //Giros
            const [businessLine] = await db.execute<RowDataPacket[]>(queryBusinessLine, [rut]);
            //Se añaden giros
            business[0].giros = businessLine
            //Esto hace que comuna se cambie por businessCommune[0]
            //Se añaden codigo y nombre de comuna
            const [businessCommune] = await db.execute<RowDataPacket[]>(queryCommune, [rut]);
            business[0].comuna = businessCommune[0]

            return business[0];
        } catch (err) {
            throw err;
        }
    }


    // Actualizar completamente una empresa PUT
    static async update(
        rut: string,
        nuevo_rut: string,
        razonSocial: string,
        nombreDeFantasia: string,
        emailFactura: string,
        direccion: string,
        comuna: string,
        telefono: string
    ): Promise<RowDataPacket> {
        const queryUpdate = `UPDATE ${this.nombreTabla} SET rut = ?, razon_social = ?, nombre_de_fantasia = ?, email_factura = ?, direccion = ?, comuna = ?, telefono = ? WHERE rut = ?`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE rut = ?`;
        const queryCommune = `SELECT * FROM comunas WHERE id = ?`;
        try {
            // Se comprueba si la empresa ya existe
            const [existingBusiness] = await db.execute<RowDataPacket[]>(
                querySelect,
                [rut]
            );
            if (!existingBusiness[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "La empresa que intenta actualizar no existe",
                        value: rut,
                        path: "rut",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            //Se comprueba si la comuna existe
            const [commune] = await db.execute<RowDataPacket[]>(queryCommune, [
                comuna,
            ]);
            if (!commune[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Comuna no encontrada",
                        value: `${comuna}`,
                        path: "comuna",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            // Se comprueba si el nuevo_email pertenece a otro usuario
            const [existingOtherBusiness] = await db.execute<RowDataPacket[]>(
                querySelect,
                [nuevo_rut]
            );


            if (existingOtherBusiness[0] && rut !== nuevo_rut) {
                const errors = [
                    {
                        type: "field",
                        msg: "El nuevo rut pertenece a otra empresa",
                        value: nuevo_rut,
                        path: "nuevo_rut",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 409);

            }

            // Ejecutar la consulta de actualización completa
            await db.execute<ResultSetHeader>(queryUpdate, [
                nuevo_rut,
                razonSocial,
                nombreDeFantasia,
                emailFactura,
                direccion,
                comuna,
                telefono,
                rut,
            ]);

            // Retornar la empresa actualizada
            const [updatedBusiness] = await db.execute<RowDataPacket[]>(querySelect, [
                nuevo_rut,
            ]);

            return updatedBusiness[0];
        } catch (err) {

            throw err;
        }
    }

    // Actualizar parcialmente una empresa PATCH
    static async partialUpdate(
        rut: string,
        fieldsToUpdate: Partial<{ nuevo_rut: string, razon_social: string; nombre_de_fantasia: string; email_factura: string; direccion: string; comuna: string; telefono: string; }>
    ): Promise<RowDataPacket> {
        let queryUpdate = `UPDATE ${this.nombreTabla} SET `;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE rut = ?`;
        const queryCommune = `SELECT * FROM comunas WHERE id = ?`;

        const fields = [];
        const values = [];

        // Construimos dinámicamente la consulta solo con los campos proporcionados
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            if (key === "nuevo_rut" && value !== undefined && value !== null) {
                fields.push(`rut = ?`);
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
            const errors = [{ type: "field", msg: "No hay campos para actualizar", value: rut, path: "rut", location: "body" }];
            throw new KeepFormatError(errors, 400);
        }

        queryUpdate += fields.join(", ") + ` WHERE rut = ?`;
        values.push(rut);


        try {
            // Se comprueba si la empresa ya existe
            const [existingBusiness] = await db.execute<RowDataPacket[]>(querySelect, [rut]);
            if (!existingBusiness[0]) {
                const errors = [{ type: "field", msg: "La empresa que intenta actualizar no existe", value: rut, path: "rut", location: "body" }];
                throw new KeepFormatError(errors, 404);
            }

            const newRutBusiness = Object.entries(fieldsToUpdate)[0][1];
            if (newRutBusiness) {
                const [existingOtherBusiness] = await db.execute<RowDataPacket[]>(
                    querySelect,
                    [newRutBusiness]
                );

                if (existingOtherBusiness[0] && rut !== newRutBusiness) {
                    const errors = [
                        {
                            type: "field",
                            msg: "El nuevo rut le pertenece a otra empresa",
                            value: newRutBusiness,
                            path: "nuevo_rut",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 409);

                }
            }

            //Si se pasa por parametro comuna se verifica que exista
            const newCommune = Object.entries(fieldsToUpdate)[5][1];
            if (newCommune) {
                const [commune] = await db.execute<RowDataPacket[]>(queryCommune, [newCommune]);
                if (!commune[0]) {
                    const errors = [
                        {
                            type: "field",
                            msg: "Comuna no encontrada",
                            value: `${newCommune}`,
                            path: "comuna",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 404);
                }

            }

            // Ejecutar la consulta de actualización parcial
            await db.execute<ResultSetHeader>(queryUpdate, values);
            // Si existe un rut nuevo se cambia
            const newRut = Object.entries(fieldsToUpdate)[0][1];
            let queryRut = rut;
            if (newRut) {
                queryRut = newRut;
            }
            // Retornar la empresa actualizada
            const [updatedBusiness] = await db.execute<RowDataPacket[]>(querySelect, [queryRut]);
            return updatedBusiness[0];
        } catch (err) {
            throw err;
        }
    }

    // Eliminar
    static async delete(rut: string): Promise<RowDataPacket> {
        const queryDelete = `DELETE FROM ${this.nombreTabla} WHERE rut = ?`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE rut = ?`;
        try {
            const [business] = await db.execute<RowDataPacket[]>(querySelect, [rut]);
            if (!business[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "La empresa que intenta eliminar no existe",
                        value: `${rut}`,
                        path: `rut`,
                        location: "params",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            await db.execute<ResultSetHeader>(queryDelete, [rut]);

            return business[0];
        } catch (err) {
            throw err;
        }
    }
}

export default Business;
