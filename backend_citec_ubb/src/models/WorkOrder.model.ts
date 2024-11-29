import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import KeepFormatError from "../utils/KeepFormatErrors";

class WorkOrder{
    static dependencies = ["provincias","comunas","empresas"];   //agregar clave foranea de factura al final para probar 
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
                    comuna INT NOT NULL,
                    descripcion VARCHAR(100) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (comuna) REFERENCES comunas(id),
                    FOREIGN KEY (provincia) REFERENCES provincias(id),
                    FOREIGN KEY (cliente) REFERENCES empresas(rut)
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
    numeroFolio: number,
    fechaSolicitud: Date,
    fechaEntrega: Date,
    observacion: string,
    cliente: string,
    direccion: string,
    provincia: number,
    comuna: number,
    descripcion: string
): Promise<RowDataPacket> {
    const queryInsert = `INSERT INTO ${this.nombreTabla} (numero_folio, fecha_solicitud, fecha_entrega, observacion, cliente, direccion, provincia, comuna ,descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const querySelect = 'SELECT * FROM orden_de_trabajo WHERE numero_folio = ?';
    const queryBusiness = `SELECT * FROM empresas WHERE rut = ?`;
    //agregar si existe factura    

    try {
        //Se comprueba si el cliente existe
        const [Business] = await db.execute<RowDataPacket[]>(queryBusiness, [
            cliente,
        ]);
        if (!Business[0]) {
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
        //Se comprueba si la orden de trabajo ya existe
        const [queryWorkOrder] = await db.execute<RowDataPacket[]>(querySelect, [
            numeroFolio,
        ]);
        if (queryWorkOrder[0]) {
            const errors = [
                {
                    type: "field",
                    msg: "La empresa que intenta crear ya existe",
                    value: `${numeroFolio}`,
                    path: "runumero_folio",
                    location: "body",
                },
            ];
            throw new KeepFormatError(errors, 409);
        }
        // Ejecuta la consulta de inserción
        await db.execute<ResultSetHeader>(queryInsert, [
            numeroFolio,
            fechaSolicitud,
            fechaEntrega,
            observacion,
            cliente,
            direccion,
            provincia,
            comuna,
            descripcion
        ]);

        const [business] = await db.execute<RowDataPacket[]>(querySelect, [numeroFolio]);

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
            const [Orden] = await db.execute<RowDataPacket[]>(querySelect);
            if (!Orden[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "No existen ordenes de trabajo",
                        value: ``,
                        path: "",
                        location: "",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }
            return Orden;
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

}

export default WorkOrder;