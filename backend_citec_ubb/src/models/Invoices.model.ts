import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import KeepFormatError from "../utils/KeepFormatErrors";
import {PdfTransformInvoice}  from "../utils/PdfTransform";
import path from "path";


class Invoices {
    //Modelo SQL de la clase
    static dependencies = ["empresas", "servicios", "giros", "usuarios", "estados"];
    private static nombreTabla: string = "facturas";

    static async initTable(): Promise<void> {

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.nombreTabla} (
                numero_folio INT NOT NULL AUTO_INCREMENT COMMENT 'numero de la factura',
                pago_neto DECIMAL(11,2) NOT NULL COMMENT 'pago sin iva',
                iva DECIMAL(11,2) DEFAULT 0 COMMENT 'iva de la cotización',
                fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                emisor VARCHAR(200) NOT NULL,
                rut_receptor VARCHAR(200) NOT NULL,
                codigo_giro INT NOT NULL,
                imagen VARCHAR(200),
                estado VARCHAR(20) NOT NULL DEFAULT 'activo',
                usuario VARCHAR(200) NOT NULL,
                exento_iva ENUM('si', 'no') DEFAULT 'no',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (numero_folio),
                FOREIGN KEY (rut_receptor) REFERENCES empresas(rut) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (codigo_giro) REFERENCES giros(codigo) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (usuario) REFERENCES usuarios(email) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (estado) REFERENCES estados(nombre) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Lista de facturas';
        `;

        // const insertDataQuery = `
        //     INSERT INTO ${this.nombreTabla} (url, clave) VALUES 
        //         ('','')
        //         ON DUPLICATE KEY UPDATE clave = VALUES(clave);
        // `;

        try {
            // Crear la tabla si no existe
            await db.query(createTableQuery);
            // Insertar valores por defecto si es necesario
            // await db.query(insertDataQuery);
        } catch (err) {
            console.error(`Error al inicializar la tabla ${this.nombreTabla}:`, err);
            throw err;
        }
    }

    // Crear POST
    static async create(
        pago_neto: number,
        iva: number,
        rut_receptor: string,
        codigo_giro: string,
        usuario: string,
        exento_iva: string,
        precio_por_servicio: Array<{ precio_neto: number, nombre: string }>
    ): Promise<RowDataPacket> {
        const queryInsert = `INSERT INTO ${this.nombreTabla} (pago_neto, iva, emisor, rut_receptor, codigo_giro, imagen, usuario, exento_iva) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const queryEmisorReceptor = `SELECT * FROM empresas WHERE rut = ?`
        const queryGiros = `SELECT * FROM giros WHERE codigo = ?`
        const queryServicios = `SELECT * FROM servicios WHERE nombre = ?`
        const queryUsuario = `SELECT * FROM usuarios WHERE email = ?`
        try {

            // En realidad el rut emisor es el de la universidad y queda fijo
            // const [rutEmisor] = await db.execute<RowDataPacket[]>(queryEmisorReceptor, [
            //     rut_emisor,
            // ]);
            // if (!rutEmisor[0]) {
            //     const errors = [
            //         {
            //             type: "field",
            //             msg: "Rut del emisor no encontrado",
            //             value: `${rut_emisor}`,
            //             path: "rut_emisor",
            //             location: "body",
            //         },
            //     ];
            //     throw new KeepFormatError(errors, 404);
            // }


            const [rutReceptor] = await db.execute<RowDataPacket[]>(queryEmisorReceptor, [
                rut_receptor,
            ]);
            if (!rutReceptor[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Rut del receptor no encontrado",
                        value: `${rut_receptor}`,
                        path: "rut_receptor",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }
            const [codigoGiro] = await db.execute<RowDataPacket[]>(queryGiros, [
                codigo_giro,
            ]);
            if (!codigoGiro[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Codigo del giro no encontrado",
                        value: `${codigo_giro}`,
                        path: "codigo_giro",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            //verificar si el pago_neto es la suma de los servicios

            let suma = 0;
            const servicioSet = new Set<string>();
            // Validar servicios
            for (const servicio of precio_por_servicio) {
                // Validar duplicados en la lista
                if (servicioSet.has(servicio.nombre)) {
                    const errors = [
                        {
                            type: "field",
                            msg: "Servicio duplicado en la lista",
                            value: `${servicio.nombre}`,
                            path: "precio_por_servicio",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 409);
                }
                servicioSet.add(servicio.nombre);

                const [servicioDB] = await db.execute<RowDataPacket[]>(queryServicios, [servicio.nombre]);
                if (!servicioDB[0]) {
                    const errors = [
                        {
                            type: "field",
                            msg: "Servicio no encontrado",
                            value: `${servicio.nombre}`,
                            path: "precio_por_servicio",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 404);
                }

                suma += servicio.precio_neto
            }

            if (suma !== pago_neto) {
                const errors = [
                    {
                        type: "field",
                        msg: "No coincide el precio de los servicios con el pago neto total",
                        value: `${pago_neto}`,
                        path: "precio_por_servicio",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            if(iva !== pago_neto*0.19 && exento_iva === 'no'){
                const errors = [
                    {
                        type: "field",
                        msg: "No coincide el iva",
                        value: `${iva}`,
                        path: "iva",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }
            const [usuarios] = await db.execute<RowDataPacket[]>(queryUsuario, [
                usuario,
            ]);
            if (!usuarios[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Usuario no encontrado",
                        value: `${usuario}`,
                        path: "usuario",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }



            const rut_emisor = "Rut Citec"
            // Ejecuta la consulta de inserción
            const [result] = await db.execute<ResultSetHeader>(queryInsert, [
                pago_neto,       // 1
                iva,             // 2
                rut_emisor,      // 3
                rut_receptor,    // 4
                codigo_giro,     // 5
                null,            // 6 (valor para `imagen`)
                usuario ,        // 7
                exento_iva
            ]);

            const nombreGiro = codigoGiro[0].nombre;
            const numeroFolio = result.insertId;

            const relativePdfPath = PdfTransformInvoice(numeroFolio, pago_neto, iva, rut_emisor, rut_receptor, nombreGiro, usuario, exento_iva , precio_por_servicio);

            // Actualizar la ruta del PDF en la base de datos
            const queryUpdate = `UPDATE ${this.nombreTabla} SET imagen = ? WHERE numero_folio = ?`;
            await db.execute<ResultSetHeader>(queryUpdate, [relativePdfPath, numeroFolio]);

            const queryInsertService = `INSERT INTO facturas_servicios (numero_folio, nombre, precio_neto) VALUES (?,?,?)`;
            for (const servicio of precio_por_servicio) {
                await db.execute<ResultSetHeader>(queryInsertService, [numeroFolio, servicio.nombre, servicio.precio_neto]);
            }

            const invoiceResult = await this.getById(numeroFolio);
            // Devolvemos la factura creada
            return invoiceResult;
        } catch (err) {
            throw err;
        }
    }

    static async getAll(): Promise<RowDataPacket[]> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE estado ='activo'`;
        const queryServicios = `SELECT facturas_servicios.precio_neto, servicios.nombre FROM ${this.nombreTabla} INNER JOIN facturas_servicios ON facturas_servicios.numero_folio = ${this.nombreTabla}.numero_folio INNER JOIN servicios ON facturas_servicios.nombre = servicios.nombre WHERE facturas_servicios.numero_folio = ?`;

        try {
            const [invoices] = await db.execute<RowDataPacket[]>(querySelect);


            if (!invoices[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "No existen facturas",
                        value: ``,
                        path: "",
                        location: "",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }


            for(const invoice of invoices){
                
                const [serviciosFactura] = await db.execute<RowDataPacket[]>(
                    queryServicios,
                    [invoice.numero_folio]
                );
                //Se añaden servicios
                invoice.precio_por_servicio = serviciosFactura;
            }



            return invoices;
        } catch (err) {
            throw err;
        }
    }

    // Obtener todos
    static async getAllDeleted(): Promise<RowDataPacket[]> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE estado = 'eliminado' `;
        const queryServicios = `SELECT facturas_servicios.precio_neto, servicios.nombre FROM ${this.nombreTabla} INNER JOIN facturas_servicios ON facturas_servicios.numero_folio = ${this.nombreTabla}.numero_folio INNER JOIN servicios ON facturas_servicios.nombre = servicios.nombre WHERE facturas_servicios.numero_folio = ?`;
        try {
            const [invoices] = await db.execute<RowDataPacket[]>(querySelect);

            if (!invoices[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "No existen facturas eliminadas",
                        value: ``,
                        path: "",
                        location: "",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            for(const invoice of invoices){
                
                const [serviciosFactura] = await db.execute<RowDataPacket[]>(
                    queryServicios,
                    [invoice.numero_folio]
                );
                //Se añaden servicios
                invoice.precio_por_servicio = serviciosFactura;
            }

            return invoices;
        } catch (err) {
            throw err;
        }
    }

    // Obtener por ID
    static async getById(numero_folio: number): Promise<RowDataPacket> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE numero_folio = ?`;
        const queryServicios = `SELECT facturas_servicios.precio_neto, servicios.nombre FROM ${this.nombreTabla} INNER JOIN facturas_servicios ON facturas_servicios.numero_folio = ${this.nombreTabla}.numero_folio INNER JOIN servicios ON facturas_servicios.nombre = servicios.nombre WHERE facturas_servicios.numero_folio = ?`;

        try {
            const [facturas] = await db.execute<RowDataPacket[]>(querySelect, [numero_folio]);
            if (!facturas[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Factura no encontrada",
                        value: `${numero_folio}`,
                        path: "numero_folio",
                        location: "params",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            const [serviciosFactura] = await db.execute<RowDataPacket[]>(
                queryServicios,
                [numero_folio]
            );
            //Se añaden servicios
            facturas[0].precio_por_servicio = serviciosFactura;


            return facturas[0];
        } catch (err) {
            throw err;
        }
    }

    static async delete(numero_folio: number): Promise<RowDataPacket> {
        const queryDelete = `UPDATE ${this.nombreTabla} SET estado = 'eliminado' WHERE numero_folio = ?`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE numero_folio = ?`;
        try {
            const [invoices] = await db.execute<RowDataPacket[]>(querySelect, [numero_folio]);
            if (!invoices[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "La factura que intenta eliminar no existe",
                        value: `${numero_folio}`,
                        path: `nombre`,
                        location: "params",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            if (invoices[0].estado === 'eliminado') {
                const errors = [
                    {
                        type: "field",
                        msg: "La factura que intenta eliminar ya ha sido eliminada",
                        value: `${numero_folio}`,
                        path: `nombre`,
                        location: "params",
                    },
                ];
                throw new KeepFormatError(errors, 409);
            }


            await db.execute<ResultSetHeader>(queryDelete, [numero_folio]);
            
            const result = await this.getById(numero_folio);
            return result;
        } catch (err) {
            throw err;
        }
    }

    static async update(
        numero_folio: number,
        pago_neto: number,
        iva: number,
        rut_receptor: string,
        codigo_giro: string,
        estado: string,
        usuario: string,
        exento_iva: string,
        precio_por_servicio: Array<{ precio_neto: number, nombre: string }>
    ): Promise<RowDataPacket> {
        const queryUpdate = `UPDATE ${this.nombreTabla} SET pago_neto = ?, iva = ?, rut_receptor = ?, codigo_giro = ?, estado = ?, usuario = ?, exento_iva = ?  WHERE numero_folio = ? `;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE numero_folio = ?`;

        const queryEmisorReceptor = `SELECT * FROM empresas WHERE rut = ?`
        const queryGiros = `SELECT * FROM giros WHERE codigo = ?`
        const queryServicios = `SELECT * FROM servicios WHERE nombre = ?`
        const queryUsuario = `SELECT * FROM usuarios WHERE email = ?`
        try {
            
            const [existingInvoice] = await db.execute<RowDataPacket[]>(
                querySelect,
                [numero_folio]
            );
            if (!existingInvoice[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "La factura que intenta actualizar no existe",
                        value: `${numero_folio}`,
                        path: "numero_folio",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            const [rutReceptor] = await db.execute<RowDataPacket[]>(queryEmisorReceptor, [
                rut_receptor,
            ]);
            if (!rutReceptor[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Rut del receptor no encontrado",
                        value: `${rut_receptor}`,
                        path: "rut_receptor",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }
            const [codigoGiro] = await db.execute<RowDataPacket[]>(queryGiros, [
                codigo_giro,
            ]);
            if (!codigoGiro[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Codigo del giro no encontrado",
                        value: `${codigo_giro}`,
                        path: "codigo_giro",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            //verificar si el pago_neto es la suma de los servicios

            let suma = 0;
            const servicioSet = new Set<string>();
            // Validar servicios
            for (const servicio of precio_por_servicio) {
                // Validar duplicados en la lista
                if (servicioSet.has(servicio.nombre)) {
                    const errors = [
                        {
                            type: "field",
                            msg: "Servicio duplicado en la lista",
                            value: `${servicio.nombre}`,
                            path: "precio_por_servicio",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 409);
                }
                servicioSet.add(servicio.nombre);

                const [servicioDB] = await db.execute<RowDataPacket[]>(queryServicios, [servicio.nombre]);
                if (!servicioDB[0]) {
                    const errors = [
                        {
                            type: "field",
                            msg: "Servicio no encontrado",
                            value: `${servicio.nombre}`,
                            path: "precio_por_servicio",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 404);
                }

                suma += servicio.precio_neto
            }



            if (suma !== pago_neto) {
                const errors = [
                    {
                        type: "field",
                        msg: "No coincide el precio de los servicios con el pago neto total",
                        value: `${pago_neto}`,
                        path: "precio_por_servicio",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            if(iva !== pago_neto*0.19 && exento_iva === 'no'){
                const errors = [
                    {
                        type: "field",
                        msg: "No coincide el iva",
                        value: `${iva}`,
                        path: "iva",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            const [usuarios] = await db.execute<RowDataPacket[]>(queryUsuario, [
                usuario,
            ]);
            if (!usuarios[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Usuario no encontrado",
                        value: `${usuario}`,
                        path: "usuario",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            const queryEstados = `SELECT * FROM estados WHERE nombre = ?`
            const [estados] = await db.execute<RowDataPacket[]>(queryEstados, [
                estado,
            ]);
            if (!estados[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Estado no encontrado",
                        value: `${estado}`,
                        path: "estado",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            // Actualizar la información de la factura
            await db.execute<ResultSetHeader>(queryUpdate, [
                pago_neto,
                iva,
                rut_receptor,
                codigo_giro,
                estado,
                usuario,
                exento_iva,
                numero_folio
            ]);
            const deleteServices = `DELETE FROM facturas_servicios WHERE numero_folio = ?`;
            await db.execute<ResultSetHeader>(deleteServices, [
                numero_folio
            ]);
            // precio_por_servicio: Array<{ precio_neto: number, nombre: string }>
            const queryInsertService = `INSERT INTO facturas_servicios (numero_folio, nombre, precio_neto) VALUES (?,?,?)`;
            for (const servicio of precio_por_servicio) {
                await db.execute<ResultSetHeader>(queryInsertService, [numero_folio, servicio.nombre, servicio.precio_neto]);
            }

            const nombreGiro = codigoGiro[0].nombre;
            const rut_emisor = "Rut Citec"
            PdfTransformInvoice(numero_folio, pago_neto, iva, rut_emisor, rut_receptor, nombreGiro, usuario, exento_iva , precio_por_servicio);
            // Retornar la factura
            const invoiceResult = await this.getById(numero_folio);
            return invoiceResult;
        } catch (err) {
            throw err;
        }
    }

}

export default Invoices;