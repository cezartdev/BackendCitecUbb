import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import KeepFormatError from "../utils/KeepFormatErrors";
import path from "path";

class WorkOrder{
    static dependencies = ["facturas","provincias","comunas","empresas","estados"];   //agregar clave foranea de factura al final para probar 
    private static nombreTabla: string = "orden_de_trabajo";

        //Modelo SQL de la clase
        static async initTable(): Promise<void> {
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS ${this.nombreTabla} (
                    numero_folio INT PRIMARY KEY,
                    fecha_solicitud DATE NOT NULL,
                    fecha_entrega DATE NOT NULL,
                    observacion VARCHAR(300) NOT NULL,
                    cliente VARCHAR(200) NOT NULL,
                    direccion VARCHAR(250) NOT NULL,
                    provincia INT NOT NULL,
                    estado VARCHAR(20) NOT NULL DEFAULT 'activo',
                    comuna INT NOT NULL,
                    descripcion VARCHAR(100) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (numero_folio) REFERENCES facturas(numero_folio) ON UPDATE CASCADE,
                    FOREIGN KEY (comuna) REFERENCES comunas(id) ON UPDATE CASCADE,
                    FOREIGN KEY (provincia) REFERENCES provincias(id) ON UPDATE CASCADE,
                    FOREIGN KEY (cliente) REFERENCES empresas(rut) ON UPDATE CASCADE,
                    FOREIGN KEY (estado) REFERENCES estados(nombre) ON UPDATE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Lista de empresas o clientes';
            `;

            try {
                // Crear la tabla si no existe
                await db.query(createTableQuery);
            } catch (err) {
                console.error(`Error al inicializar la tabla ${this.nombreTabla}:`, err);
                throw err;
            }
}

static async create(
    numero_folio: number,
    observacion: string,
    cliente: string,
    direccion: string,
    provincia: number,
    comuna: number,
    descripcion: string,
    servicios:Array<{ nombre: string }>
): Promise<RowDataPacket> {
    const queryInsert = `INSERT INTO ${this.nombreTabla} (numero_folio, observacion, cliente, direccion, provincia, comuna ,descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const queryCliente = `SELECT * FROM empresas WHERE rut = ?`
        const queryServicios = `SELECT * FROM servicios WHERE nombre = ?`
        const queryProvincia = `SELECT * FROM provincias WHERE id = ?`
        const queryComuna = `SELECT * FROM comunas WHERE id = ?`
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE numero_folio = ?`;
    try {
        
        const [rutCliente] = await db.execute<RowDataPacket[]>(queryCliente, [
            cliente,
        ]); 

        if (!rutCliente[0]) {
            const errors = [
                {
                    type: "field",
                    msg: "Cliente no encontrado",
                    value: `${cliente}`,
                    path: "cliente",
                    location: "body",
                },
            ];
            throw new KeepFormatError(errors, 404);
        }

        const [idProvincia] = await db.execute<RowDataPacket[]>(queryProvincia, [
            provincia,
        ]);

        if (!idProvincia[0]) {
            const errors = [
                {
                    type: "field",
                    msg: "Provincia no encontrada",
                    value: `${provincia}`, 
                    path: "provincia",
                    location: "body",
                },
            ];
            throw new KeepFormatError(errors, 404);
        }   
        
        const [idComuna] = await db.execute<RowDataPacket[]>(queryComuna, [
            comuna,
        ]);

        if (!idComuna[0]) {
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
        const servicioSet = new Set<string>();
    // Validar servicios
        for (const servicio of servicios) {
            // Validar duplicados en la lista
            if (servicioSet.has(servicio.nombre)) {
                const errors = [
                    {
                    type: "field",
                    msg: "Servicio duplicado en la lista",
                    value: `${servicio.nombre}`,
                    path: "servicios",
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
                path: "servicios",
                location: "body",
            },
        ];
        throw new KeepFormatError(errors, 404);
    }
    }

        //Se comprueba si la orden de trabajo ya existe
        const [WorkOrder] = await db.execute<RowDataPacket[]>(querySelect, [
            numero_folio,
        ]);
        if (WorkOrder[0]) {
            const errors = [
                {
                    type: "field",
                    msg: "La empresa que intenta crear ya existe",
                    value: `${numero_folio}`,
                    path: "numero_folio",
                    location: "body",
                },
            ];
            throw new KeepFormatError(errors, 409);
        }


        // Ejecuta la consulta de inserción
        const [result] = await db.execute<ResultSetHeader>(queryInsert, [
            observacion,
            cliente,
            direccion,
            provincia,
            comuna,
            descripcion,
        ]);
        
        const nombreProvincia = idProvincia[0].nombre;
        const nombreComuna = idComuna[0].nombre;
        const numeroFolio = result.insertId;
        const relativePdfPath = path.posix.join("pdf", `orden_de_trabajo_${numeroFolio}.pdf`);
        const absolutePdfPath = path.join(__dirname, "..", "../", relativePdfPath);


        //PdfTransform(numeroFolio,observacion, cliente, direccion, provincia, comuna , descripcion, absolutePdfPath);

        // Actualizar la ruta del PDF en la base de datos
        const queryUpdate = `UPDATE ${this.nombreTabla} SET imagen = ? WHERE numero_folio = ?`;
        await db.execute<ResultSetHeader>(queryUpdate, [relativePdfPath, numeroFolio]);

        const queryInsertService = `INSERT INTO facturas_servicios (numero_folio, nombre, precio_neto) VALUES (?,?,?)`;
        for (const servicio of servicios) {
            await db.execute<ResultSetHeader>(queryInsertService, [numeroFolio, servicio.nombre]);
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
    const queryServicios = `SELECT servicios.nombre FROM ${this.nombreTabla} INNER JOIN facturas_servicios ON facturas_servicios.numero_folio = ${this.nombreTabla}.numero_folio INNER JOIN servicios ON facturas_servicios.nombre = servicios.nombre WHERE facturas_servicios.numero_folio = ?`;

    try {
        const [workOrder] = await db.execute<RowDataPacket[]>(querySelect);

        if (!workOrder[0]) {
            const errors = [
                {
                    type: "field",
                    msg: "No existen ordenes de tabajo",
                    value: ``,
                    path: "",
                    location: "",
                },
            ];
            throw new KeepFormatError(errors, 404);
        }

        for(const order of workOrder){
                
            const [serviciosFactura] = await db.execute<RowDataPacket[]>(
                queryServicios,
                [order.numero_folio]
            );
            //Se añaden servicios
            order.nombre = serviciosFactura;
        }

        return workOrder;
    } catch (err) {
        throw err;
    }
}

        // Obtener por folio
        static async getById(numeroFolio: number): Promise<RowDataPacket> {
            const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE numero_folio = ?`;
    
            try {
                const [Orden] = await db.execute<RowDataPacket[]>(querySelect,[numeroFolio]);
                if (!Orden[0]) {
                    const errors = [
                        {
                            type: "field",
                            msg: "Folio no encontrada",
                            value: `${numeroFolio}`,
                            path: "numero_folio",
                            location: "params",
                        },
                    ];
                    throw new KeepFormatError(errors, 404);
                }
                return Orden[0];
            } catch (err) {
                throw err;
            }
        }

        // Obtener todos
        static async getAllDeleted(): Promise<RowDataPacket[]> {
            const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE estado = 'eliminado' `;
            const queryServicios = `SELECT servicios.nombre FROM ${this.nombreTabla} INNER JOIN facturas_servicios ON facturas_servicios.numero_folio = ${this.nombreTabla}.numero_folio INNER JOIN servicios ON facturas_servicios.nombre = servicios.nombre WHERE facturas_servicios.numero_folio = ?`;
            try {
                const [workOrder] = await db.execute<RowDataPacket[]>(querySelect);
    
                if (!workOrder[0]) {
                    const errors = [
                        {
                            type: "field",
                            msg: "No existen ordenes de trabajo eliminadas",
                            value: ``,
                            path: "",
                            location: "",
                        },
                    ];
                    throw new KeepFormatError(errors, 404);
                }
    
                for(const invoice of workOrder){
                    
                    const [serviciosFactura] = await db.execute<RowDataPacket[]>(
                        queryServicios,
                        [invoice.numero_folio]
                    );
                    //Se añaden servicios
                    invoice.precio_por_servicio = serviciosFactura;
                }
    
                return workOrder;
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
                            msg: "La orden de trabajo que intenta eliminar no existe",
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
                            msg: "La orden de trabajo que intenta eliminar ya ha sido eliminada",
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
            observacion: string,
            cliente: string,
            direccion: string,
            provincia: number,
            comuna: number,
            estado: string,
            descripcion: string,
            servicios:Array<{ nombre: string }>
        ): Promise<RowDataPacket> {
            const queryUpdate = `UPDATE ${this.nombreTabla} SET observacion = ?, cliente = ?, direccion = ?, provincia = ?, comuna = ?, descripcion = ? WHERE numero_folio = ?`;
            const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE numero_folio = ?`;
            const queryCliente = `SELECT * FROM empresas WHERE rut = ?`
            const queryServicios = `SELECT * FROM servicios WHERE nombre = ?`
            const queryProvincia = `SELECT * FROM provincias WHERE id = ?`
            const queryComuna = `SELECT * FROM comunas WHERE id = ?`
            try {
                const [workOrder] = await db.execute<RowDataPacket[]>(querySelect, [
                    numero_folio,
                ]);
                if (!workOrder[0]) {
                    const errors = [
                        {
                            type: "field",
                            msg: "La orden de trabajo que intenta actualizar no existe",
                            value: `${numero_folio}`,
                            path: "numero_folio",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 404);
                }
                const [rutCliente] = await db.execute<RowDataPacket[]>(queryCliente, [
                    cliente,
                ]);
                if (!rutCliente[0]) {
                    const errors = [
                        {
                            type: "field",
                            msg: "Cliente no encontrado",
                            value: `${cliente}`,
                            path: "cliente",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 404);
                }
                const [idProvincia] = await db.execute<RowDataPacket[]>(queryProvincia, [
                    provincia,
                ]);
                if (!idProvincia[0]) {
                    const errors = [
                        {
                            type: "field",
                            msg: "Provincia no encontrada",
                            value: `${provincia}`,
                            path: "provincia",
                            location: "body",
                        },
                    ];
                    throw new KeepFormatError(errors, 404);
                }
                const [idComuna] = await db.execute<RowDataPacket[]>(queryComuna, [
                    comuna,
                ]);

                if (!idComuna[0]) {
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
                const servicioSet = new Set<string>();
                // Validar servicios
                for (const servicio of servicios) {
                    // Validar duplicados en la lista
                    if (servicioSet.has(servicio.nombre)) {
                        const errors = [
                            {
                                type: "field",
                                msg: "Servicio duplicado en la lista",
                                value: `${servicio.nombre}`,
                                path: "servicios",
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
                // Ejecuta la consulta de actualización
                await db.execute<ResultSetHeader>(queryUpdate, [
                    observacion,
                    cliente,
                    direccion,
                    provincia,
                    comuna,
                    descripcion,
                    numero_folio,
                ]);
                const queryDeleteService = `DELETE FROM facturas_servicios WHERE numero_folio = ?`;
                await db.execute<ResultSetHeader>(queryDeleteService, [numero_folio]);
                const queryInsertService = `INSERT INTO facturas_servicios (numero_folio, nombre) VALUES (?,?)`;
                for (const servicio of servicios) {
                    await db.execute<ResultSetHeader>(queryInsertService, [numero_folio, servicio.nombre]);
                }
                const result = await this.getById(numero_folio);
                return result;
            } catch (err) {
                throw err;
            }
        }
                            
}

export default WorkOrder;