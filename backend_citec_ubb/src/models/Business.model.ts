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
                razon_social VARCHAR(100) NOT NULL,
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
            ('84.976.200-1', 'Cerámicas Santiago S.A.', 'Cerámicas Santiago S.A.','frios@ceramicasantiago.cl','Avda Italia 1000','1101','+56912345678'),
            ('76.182.311-6', 'INMOBILIARIA VALLE NOBLE S.A.', 'INMOBILIARIA VALLE NOBLE S.A.','mchuescas@jce.cl', 'Av. Libertador B. Ohiggins 1186 Od 1401', '8101', '224142600'),
            ('76.693.087-5', 'INSATEC SpA', 'INSATEC SpA', 'insatecconsultores@gmail.com', 'Vicente Yañez Pinzón 422' ,'8103', '+56942194780'),
            ('76.525.290-3', 'EBCO S.A.', 'EBCO S.A.', 'Mauricio.salgado@ebco.cl', 'Av. Sta. Maria 2450', '13123', '+56984464725'),
            ('76.678.853-K', 'CONSTRUCTORA ALFONSO AEDO Y CIA. LTDA.', 'CONSTRUCTORA ALFONSO AEDO Y CIA. LTDA.', 'constructoratresa.ltda@gmail.com', 'Dr. Fernando Urra 440', '8103', '+56963090305'),
            ('77.122.631-0', 'InDoor SPA', 'InDoor SPA', 'jmora@indoor-spa.cl', 'Sector La Quinta s/n', '8303', '413111127'),
            ('76.182.462-7', 'INVERSIONES KINETTA LTDA.', 'INVERSIONES KINETTA LTDA.', 'michael.alvarez@kinetta.cl', 'CAMINO DEL RIO 843', '8101', '+56994895426'),
            ('96.773.280-K', 'MASONITE', 'MASONITE', 'jbenitezitriago@masonite.com', 'Los Boldos 117', '13302', '+56944628283'),
            ('77.870.508-7', 'Constructora Fuentes Limitada', 'Constructora Fuentes Limitada', 'angel.navarrete.t@gmail.com', 'santa rita lote 79', '14101', '+56981872772'),
            ('77.421.732-0', 'CONSTRUCTORA REGEVAL SPA', 'CONSTRUCTORA REGEVAL SPA', 'constructora.regeval@gmail.com', 'Dirección: Calle 4 Nº4443', '8110', '+56942488470'),
            ('76.946.090-K', 'INARDI LTDA.', 'INARDI LTDA.', 'a.cofre@inardi.cl', 'Sotomayor N°92', '8101', '412212568'),
            ('77.419.232-8', 'CMPC MADERAS SPA', 'CMPC MADERAS SPA', 'nicolas.perez@cmpc.cl', 'Avda. Las Industrias Pedro Stark Troncoso N°100', '8301', 'sinDatos'),
            ('76.282.954-1', 'TECNOPERFILES S.A.', 'TECNOPERFILES S.A.', 'rsepulveda@tecnoperfiles.com', 'Camino el Otoño 472', '13302', '+56957727836'),
            ('76.501.911-7', 'Constructora Adco Limitada', 'Constructora Adco Limitada', 'administracion@adco.cl', 'Parlamento de negrete 84', '8108', '+56982828774'),
            ('76.888.415-3', 'Servicios, construcciones e inversiones Heredia y compañia ltda.', 'INDICO', 'sociedadindico@gmail.com', 'EL MAITEN N° 1984', '8103', '412253132')


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

    // Crear POST
    static async create(
        rut: string,
        razonSocial: string,
        nombreDeFantasia: string,
        emailFactura: string,
        direccion: string,
        comuna: string,
        telefono: string,
        contactos: Array<{ email: string; nombre: string; cargo: string }>,
        giros: Array<{ codigo: string }>
    ): Promise<RowDataPacket> {
        const queryInsert = `INSERT INTO ${this.nombreTabla} (rut, razon_social, nombre_de_fantasia, email_factura, direccion, comuna, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE rut = ?`;
        const queryCommune = `SELECT * FROM comunas WHERE id = ?`;
        const queryInsertContact = `INSERT INTO contactos (email,nombre,cargo,rut_empresa) VALUES (?,?,?,?)`;
        const queryInsertBusinessLineBusiness = `INSERT INTO giros_empresa (rut_empresa, codigo_giro) VALUES (?,?)`;
        const querySelectContacts = `SELECT * FROM contactos`;
        const querySelectBusinessLine = `SELECT * FROM giros`;
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
            
            const [businessLines] = await db.execute<RowDataPacket[]>(querySelectBusinessLine);

            for (const value of giros) {
                const businessLinesExists = businessLines.some(
                    element => String(element.codigo) === String(value.codigo)
                );
            
          
                if (!businessLinesExists) {
                    const errors = [
                        {
                            type: "field",
                            msg: "Giro no encontrado",
                            value: `${value.codigo}`,
                            path: "giros",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 404);
                }
            }

            const [contacts] = await db.execute<RowDataPacket[]>(querySelectContacts);

            for (const value of contactos) {
                const emailExists = contacts.some(
                    (contact) => contact.email === value.email
                );

                if (emailExists) {
                    const errors = [
                        {
                            type: "field",
                            msg: "El contacto que intenta asignar ya existe en otra empresa",
                            value: `${value.email}`,
                            path: "email",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 409);
                }
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

          

            //Se insertan los giros correspondientes a la empresa
            for (const value of giros) {
                await db.execute<ResultSetHeader>(queryInsertBusinessLineBusiness, [
                    rut,
                    value.codigo,
                ]);
            }


            //Se insertan los contactos correspondientes a la empresa
            for (const value of contactos) {
                await db.execute<ResultSetHeader>(queryInsertContact, [
                    value.email,
                    value.nombre,
                    value.cargo,
                    rut,
                ]);
            }

            const businessResult = await this.getById(rut);
            // Devolvemos a la empresa creada
            return businessResult;
        } catch (err) {
            throw err;
        }
    }

    // Obtener todos
    static async getAll(): Promise<RowDataPacket[]> {
        const querySelect = `SELECT * FROM ${this.nombreTabla}`;
        const queryBusinessLine = `SELECT giros_empresa.codigo_giro,giros.nombre FROM ${this.nombreTabla} INNER JOIN giros_empresa ON giros_empresa.rut_empresa = ${this.nombreTabla}.rut INNER JOIN giros ON codigo_giro = giros.codigo WHERE rut = ?`;
        const queryCommune = `SELECT comunas.id,comunas.nombre FROM ${this.nombreTabla} JOIN comunas ON ${this.nombreTabla}.comuna = comunas.id WHERE rut = ?`;
        const queryContact = `SELECT c.email,c.nombre,c.cargo FROM contactos c JOIN ${this.nombreTabla} ON ${this.nombreTabla}.rut = c.rut_empresa where rut = ?`;
        try {
            const [business] = await db.execute<RowDataPacket[]>(querySelect);

            for (const value of business) {
                const [businessLine] = await db.execute<RowDataPacket[]>(
                    queryBusinessLine,
                    [value.rut]
                );
                const [businessCommune] = await db.execute<RowDataPacket[]>(
                    queryCommune,
                    [value.rut]
                );
                const [businessContacts] = await db.execute<RowDataPacket[]>(
                    queryContact,
                    [value.rut]
                );
                // Añadir el resultado de businessLine a cada objeto
                value.giros = businessLine;
                value.comuna = businessCommune[0];
                value.contactos = businessContacts;
            }

            return business;
        } catch (err) {
            throw err;
        }
    }

    // Obtener por ID
    static async getById(rut: string): Promise<RowDataPacket> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE rut = ?`;
        const queryBusinessLine = `SELECT giros_empresa.codigo_giro,giros.nombre FROM ${this.nombreTabla} INNER JOIN giros_empresa ON giros_empresa.rut_empresa = ${this.nombreTabla}.rut INNER JOIN giros ON codigo_giro = giros.codigo WHERE rut = ?`;
        const queryCommune = `SELECT comunas.id,comunas.nombre FROM ${this.nombreTabla} JOIN comunas ON ${this.nombreTabla}.comuna = comunas.id WHERE rut = ?`;
        const queryContact = `SELECT c.email,c.nombre,c.cargo FROM contactos c JOIN ${this.nombreTabla} ON ${this.nombreTabla}.rut = c.rut_empresa where rut = ?`;
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
            const [businessLine] = await db.execute<RowDataPacket[]>(
                queryBusinessLine,
                [rut]
            );
            //Se añaden giros
            business[0].giros = businessLine;
            //Esto hace que comuna se cambie por businessCommune[0]
            //Se añaden codigo y nombre de comuna
            const [businessCommune] = await db.execute<RowDataPacket[]>(
                queryCommune,
                [rut]
            );
            business[0].comuna = businessCommune[0];

            //Se añaden los contactos de una empresa
            const [businessContacts] = await db.execute<RowDataPacket[]>(
                queryContact,
                [rut]
            );
            business[0].contactos = businessContacts;
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
        telefono: string,
        contactos: Array<{ email: string; nombre: string; cargo: string }>,
        giros: Array<{ codigo: string }>
    ): Promise<RowDataPacket> {
        const queryUpdate = `UPDATE ${this.nombreTabla} SET rut = ?, razon_social = ?, nombre_de_fantasia = ?, email_factura = ?, direccion = ?, comuna = ?, telefono = ? WHERE rut = ?`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE rut = ?`;
        const queryCommune = `SELECT * FROM comunas WHERE id = ?`;
        const queryDeleteContacts = `DELETE FROM contactos WHERE rut_empresa = ?`;
        const queryInsertContact = `INSERT INTO contactos (email,nombre,cargo,rut_empresa) VALUES (?,?,?,?)`;
        const queryDeleteBusinessLine = `DELETE FROM giros_empresa WHERE rut_empresa = ?`;
        const queryInsertBusinessLineBusiness = `INSERT INTO giros_empresa (rut_empresa, codigo_giro) VALUES (?,?)`;
        const querySelectContacts = `SELECT * FROM contactos`;
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

            // Se comprueba si la comuna existe
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

            // Se comprueba si el nuevo_rut pertenece a otra empresa
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

            //TODO: Realizar inserciones despues de validar todo
            const [contacts] = await db.execute<RowDataPacket[]>(querySelectContacts);
            for (const value of contactos) {
                const contactsExists = contacts.some(
                    (contact) => contact.email === value.email && contact.rut_empresa !== rut
                );

                if (contactsExists) {
                    const errors = [
                        {
                            type: "field",
                            msg: "El contacto que intenta asignar ya existe en otra empresa",
                            value: `${value.email}`,
                            path: "contactos",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 409);
                }
            }

            // Actualizar la información de la empresa
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
            
            // Eliminar los contactos antiguos
            await db.execute<ResultSetHeader>(queryDeleteContacts, [nuevo_rut]);
            
            // Insertar los nuevos contactos
            for (const value of contactos) {
                await db.execute<ResultSetHeader>(queryInsertContact, [
                    value.email,
                    value.nombre,
                    value.cargo,
                    nuevo_rut,
                ]);
            }
            // Eliminar los giros antiguos
            await db.execute<ResultSetHeader>(queryDeleteBusinessLine, [nuevo_rut]);
            
            
            // Insertar los nuevos giros
            for (const value of giros) {
                
                await db.execute<ResultSetHeader>(queryInsertBusinessLineBusiness, [
                    nuevo_rut,
                    value.codigo,
                ]);
            }

            // Retornar la empresa actualizada
            const businessResult = await this.getById(nuevo_rut);
            return businessResult;
        } catch (err) {
            throw err;
        }
    }

    // Actualizar parcialmente una empresa PATCH
    static async partialUpdate(
        rut: string,
        fieldsToUpdate: Partial<{
            nuevo_rut: string;
            razon_social: string;
            nombre_de_fantasia: string;
            email_factura: string;
            direccion: string;
            comuna: string;
            telefono: string;
            contactos: Array<{ email: string; nombre: string; cargo: string }>;
            giros: Array<{ codigo: string }>;
        }>
    ): Promise<RowDataPacket> {
        let queryUpdate = `UPDATE ${this.nombreTabla} SET `;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE rut = ?`;
        const queryCommune = `SELECT * FROM comunas WHERE id = ?`;
        const queryDeleteContacts = `DELETE FROM contactos WHERE rut_empresa = ?`;
        const queryInsertContact = `INSERT INTO contactos (email, nombre, cargo, rut_empresa) VALUES (?, ?, ?, ?)`;
        const queryDeleteBusinessLines = `DELETE FROM giros_empresa WHERE rut_empresa = ?`;
        const queryInsertBusinessLine = `INSERT INTO giros_empresa (rut_empresa, codigo_giro) VALUES (?, ?)`;

        const fields = [];
        const values = [];

        // Construimos dinámicamente la consulta solo con los campos proporcionados
        for (const [key, value] of Object.entries(fieldsToUpdate)) {
            if (key === "nuevo_rut" && value !== undefined && value !== null) {
                fields.push(`rut = ?`);
                values.push(value);
                continue;
            }
            if (value !== undefined && value !== null) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        // Si no hay campos para actualizar, lanzamos un error
        if (
            fields.length === 0 &&
            !fieldsToUpdate.contactos &&
            !fieldsToUpdate.giros
        ) {
            const errors = [
                {
                    type: "field",
                    msg: "No hay campos para actualizar",
                    value: rut,
                    path: "rut",
                    location: "body",
                },
            ];
            throw new KeepFormatError(errors, 400);
        }

        queryUpdate += fields.join(", ") + ` WHERE rut = ?`;
        values.push(rut);

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

            // Comprobar si el nuevo rut ya pertenece a otra empresa
            const newRut = fieldsToUpdate.nuevo_rut;
            if (newRut) {
                const [existingOtherBusiness] = await db.execute<RowDataPacket[]>(
                    querySelect,
                    [newRut]
                );
                if (existingOtherBusiness[0] && rut !== newRut) {
                    const errors = [
                        {
                            type: "field",
                            msg: "El nuevo rut le pertenece a otra empresa",
                            value: newRut,
                            path: "nuevo_rut",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 409);
                }
            }

            // Comprobar si la nueva comuna existe
            const newCommune = fieldsToUpdate.comuna;
            if (newCommune) {
                const [commune] = await db.execute<RowDataPacket[]>(queryCommune, [
                    newCommune,
                ]);
                if (!commune[0]) {
                    const errors = [
                        {
                            type: "field",
                            msg: "Comuna no encontrada",
                            value: newCommune,
                            path: "comuna",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 404);
                }
            }
            // Ejecutar la consulta de actualización parcial de la empresa
            if (fields.length > 0) {
                await db.execute<ResultSetHeader>(queryUpdate, values);
            }

            // Si hay contactos, primero eliminamos los anteriores y luego insertamos los nuevos
            if (fieldsToUpdate.contactos && fieldsToUpdate.contactos.length > 0) {
                await db.execute<ResultSetHeader>(queryDeleteContacts, [rut]);
                for (const contact of fieldsToUpdate.contactos) {
                    await db.execute<ResultSetHeader>(queryInsertContact, [
                        contact.email,
                        contact.nombre,
                        contact.cargo,
                        newRut || rut,
                    ]);
                }
            }

            // Si hay giros, primero eliminamos los anteriores y luego insertamos los nuevos
            if (fieldsToUpdate.giros && fieldsToUpdate.giros.length > 0) {
                await db.execute<ResultSetHeader>(queryDeleteBusinessLines, [rut]);
                for (const giro of fieldsToUpdate.giros) {
                    await db.execute<ResultSetHeader>(queryInsertBusinessLine, [
                        newRut || rut,
                        giro.codigo,
                    ]);
                }
            }
            // Retornar la empresa actualizada
            let businessResult;
            if (newRut) {
                businessResult = await this.getById(newRut);
            } else {
                businessResult = await this.getById(rut);
            }

            return businessResult;
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
            const businessResult = await this.getById(rut);

            await db.execute<ResultSetHeader>(queryDelete, [rut]);

            return businessResult;
        } catch (err) {
            throw err;
        }
    }
}

export default Business;
