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

    //TODO: Cambiar tipo de dato de las busquedas e inserciones RowDataPacket
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
                throw new KeepFormatError(errors);
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
                throw new KeepFormatError(errors);
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

        try {
            const [rows] = await db.execute<RowDataPacket[]>(querySelect);

            return rows;
        } catch (err) {
            throw err;
        }
    }

    // Obtener por ID

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
                throw new KeepFormatError(errors);
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
                throw new KeepFormatError(errors);
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
    //TODO: Queda implementar funcion
    // Actualizar parcialmente una empresa PATCH
    static async partialUpdate(
        rut: string,
        fieldsToUpdate: Partial<{nuevo_rut: string, razon_social: string; nombre_de_fantasia: string; email_factura: string; direccion: string; comuna: string; telefono: string; }>
    ): Promise<RowDataPacket> {
        let queryUpdate = `UPDATE ${this.nombreTabla} SET `;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE rut = ?`;
        const queryCommune = `SELECT * FROM comunas WHERE id = ?`;
        
        const fields = [];
        const values = [];

        // Construimos dinámicamente la consulta solo con los campos proporcionados
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            if(key === "nuevo_rut" && value !== undefined && value !== null){
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
            throw new KeepFormatError(errors);
        }

        queryUpdate += fields.join(", ") + ` WHERE rut = ?`;
        values.push(rut);


        try {
            // Se comprueba si la empresa ya existe
            const [existingBusiness] = await db.execute<RowDataPacket[]>(querySelect, [rut]);
            if (!existingBusiness[0]) {
                const errors = [{ type: "field", msg: "La empresa que intenta actualizar no existe", value: rut, path: "rut", location: "body" }];
                throw new KeepFormatError(errors);
            }
            
            //Si se pasa por parametro comuna se verifica que exista
            const newCommune = Object.entries(fieldsToUpdate)[5][1];
            if(newCommune){
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
                    throw new KeepFormatError(errors);
                }

            }

            // Ejecutar la consulta de actualización parcial
            await db.execute<ResultSetHeader>(queryUpdate, values);
            // Si existe el un rut nuevo se cambia
            const newRut = Object.entries(fieldsToUpdate)[0][1];
            let queryRut = rut;
            if(newRut){
                queryRut = newRut;
            }
            // Retornar la empresa actualizada
            const [updatedBusiness] = await db.execute<RowDataPacket[]>(querySelect, [queryRut]);
            return updatedBusiness[0];
        } catch (err) {
            console.log(err)
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
                throw new KeepFormatError(errors);
            }

            await db.execute<ResultSetHeader>(queryDelete, [rut]);

            return business[0];
        } catch (err) {
            throw err;
        }
    }
}

export default Business;
