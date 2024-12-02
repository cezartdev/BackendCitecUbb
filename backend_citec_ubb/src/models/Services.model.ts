import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import KeepFormatError from "../utils/KeepFormatErrors";
import { Console } from "console";
class Services {
    //Modelo SQL de la clase
    static dependencies = ["estados"];
    private static nombreTabla: string = "servicios";

    static async initTable(): Promise<void> {
       
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.nombreTabla} (
                nombre VARCHAR(200) NOT NULL COMMENT 'nombre del servicio',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                estado VARCHAR(20) NOT NULL DEFAULT 'activo',
                FOREIGN KEY (estado) REFERENCES estados(nombre),
                PRIMARY KEY (nombre)
            ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_spanish_ci COMMENT='Lista de claves';
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

    static async create(nombre: string): Promise<RowDataPacket> {
        const queryInsert = `INSERT INTO ${this.nombreTabla} (nombre) VALUES (?)`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE nombre = ?`;

        
        try {
            //Se comprueba si el servicio existe
            const [service] = await db.execute<RowDataPacket[]>(querySelect, [nombre]);
            

            if (service[0]) {
                const { estado } = service[0];
                const errors = [
                    {
                        type: "field",
                        msg: estado === "eliminado" 
                            ? "El servicio está marcado como 'eliminado'. Revierta esta acción para volver a manipularlo." 
                            : "El servicio que intenta crear ya existe",
                        value: nombre,
                        path: "nombre",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 409);
            }
            
            
            
            await db.execute<ResultSetHeader>(queryInsert, [nombre]);
            
            const serviceResult = await this.getById(nombre);

            return serviceResult;
        } catch (err) {
            throw err;
        }
    }
    

     // Obtener por ID
     static async getById(nombre: string): Promise<RowDataPacket> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE nombre = ?`;

        try {

            const [service] = await db.execute<RowDataPacket[]>(querySelect, [nombre]);
            if (!service[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "Servicio no encontrado",
                        value: `${nombre}`,
                        path: "nombre",
                        location: "params",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }
            
            return service[0];
        } catch (err) {
            throw err;
        }
    }


    // Obtener todos
    static async getAll(): Promise<RowDataPacket[]> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE estado ='activo'`;

        try {
            const [service] = await db.execute<RowDataPacket[]>(querySelect);

            if (!service[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "No existen servicios",
                        value: ``,
                        path: "",
                        location: "",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }


            return service;
        } catch (err) {
            throw err;
        }
    }

    // Obtener todos
    static async getAllDeleted(): Promise<RowDataPacket[]> {
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE estado = 'eliminado' `;

        try {
            const [service] = await db.execute<RowDataPacket[]>(querySelect);

            if (!service[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "No existen servicios",
                        value: ``,
                        path: "",
                        location: "",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }


            return service;
        } catch (err) {
            throw err;
        }
    }

    static async update(
        nombre: string,
        nuevo_nombre: string
    ): Promise<RowDataPacket> {
        const queryUpdate = `UPDATE ${this.nombreTabla} SET nombre = ? WHERE nombre = ?`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE nombre = ?`;
        try {
            
            const [existingService] = await db.execute<RowDataPacket[]>(
                querySelect,
                [nombre]
            );
            if (!existingService[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "El servicio que intenta actualizar no existe",
                        value: nombre,
                        path: "nombre",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            // Se comprueba si el nuevo_nombre pertenece a otro servicio
            const [existingOtherService] = await db.execute<RowDataPacket[]>(
                querySelect,
                [nuevo_nombre]
            );

            if (existingOtherService[0] && nombre !== nuevo_nombre) {
                const errors = [
                    {
                        type: "field",
                        msg: "El nuevo rut pertenece a otra empresa",
                        value: nuevo_nombre,
                        path: "nuevo_nombre",
                        location: "body",
                    },
                ];
                throw new KeepFormatError(errors, 409);
            }

         

            // Actualizar la información de la empresa
            await db.execute<ResultSetHeader>(queryUpdate, [
                nuevo_nombre,
                nombre
            ]);
            
        
          

            // Retornar la empresa actualizada
            const businessResult = await this.getById(nuevo_nombre);
            return businessResult;
        } catch (err) {
            throw err;
        }
    }


    static async delete(nombre: string): Promise<RowDataPacket> {
        const queryDelete = `UPDATE ${this.nombreTabla} SET estado = 'eliminado' WHERE nombre = ?`;
        const querySelect = `SELECT * FROM ${this.nombreTabla} WHERE nombre = ?`;
        try {
            const [services] = await db.execute<RowDataPacket[]>(querySelect, [nombre]);
            if (!services[0]) {
                const errors = [
                    {
                        type: "field",
                        msg: "El servicio que intenta eliminar no existe",
                        value: `${nombre}`,
                        path: `nombre`,
                        location: "params",
                    },
                ];
                throw new KeepFormatError(errors, 404);
            }

            if (services[0].estado === 'eliminado') {
                const errors = [
                    {
                        type: "field",
                        msg: "El servicio que intenta eliminar ya ha sido eliminado",
                        value: `${nombre}`,
                        path: `nombre`,
                        location: "params",
                    },
                ];
                throw new KeepFormatError(errors, 409);
            }


            await db.execute<ResultSetHeader>(queryDelete, [nombre]);
            
            const result = await this.getById(nombre);
            return result;
        } catch (err) {
            throw err;
        }
    }

}

export default Services;