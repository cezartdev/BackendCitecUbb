import db from "../config/db"
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import KeepFormatError from "../utils/KeepFormatErrors";
import PDFDocument from "pdfkit";
import fs from "fs";
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
        precio_por_servicio: Array<{ precio_neto: number, nombre: string }>
    ): Promise<RowDataPacket> {
        const queryInsert = `INSERT INTO ${this.nombreTabla} (pago_neto, iva, emisor, rut_receptor, codigo_giro, imagen, usuario) VALUES (?, ?, ?, ?, ?, ?, ?)`;
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
                usuario          // 7
            ]);



            const nombreGiro = codigoGiro[0].nombre;
            // Obtener el ID generado automáticamente
            const numeroFolio = result.insertId;

            const relativePdfPath = path.posix.join("pdf", `factura_${numeroFolio}.pdf`);
            const absolutePdfPath = path.join(__dirname, "..", "../", relativePdfPath);
            const doc = new PDFDocument({ margin: 50 });
            const fecha = new Date().toISOString().split("T")[0];
            const total = pago_neto + iva;

            doc.pipe(fs.createWriteStream(absolutePdfPath));

            // Agregar logotipo (si lo tienes)
            // doc.image("ruta/del/logotipo.png", 50, 50, { width: 100 });

            // Título de la factura
            doc.fontSize(24).font('Helvetica-Bold').text("Factura Electrónica", { align: "center" });
            doc.moveDown(1);

            // Sección del número de folio (en esquina superior derecha, negrita)
            doc.fontSize(16).font('Helvetica-Bold').text(`Folio N°${numeroFolio}`, { align: "right" });
            doc.moveDown(1);

            // Información de la factura (con un diseño más limpio)
            doc.fontSize(12).font('Helvetica').text(`Fecha: ${fecha}`, { align: "left" });
            doc.text(`Emisor: ${rut_emisor}`, { align: "left" });
            doc.text(`RUT Receptor: ${rut_receptor}`, { align: "left" });
            doc.text(`Giro: ${nombreGiro}`, { align: "left" });
            doc.text(`Generado por: ${usuario}`, { align: "left" });
            doc.moveDown(1);

            // Línea divisoria
            doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(1);

            // Agregar la sección de Neto, IVA y Total
            doc.fontSize(12).font('Helvetica-Bold').text("Totales:", { align: "left" });
            doc.fontSize(12).font('Helvetica').text(`Pago Neto: $${pago_neto.toFixed(2)}`, { align: "left" });
            doc.text(`IVA (19%): $${iva.toFixed(2)}`, { align: "left" });
            doc.text(`Total: $${total.toFixed(2)}`, { align: "left" });
            doc.moveDown(1);

            // Línea divisoria
            doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(1);

            // Título de la sección de Servicios
            doc.fontSize(14).font('Helvetica-Bold').text("Servicios", { align: "left" });
            doc.moveDown(0.5);

            // Crear tabla de servicios
            const tableTop = doc.y;
            const columnWidths = [50, 300, 100];

            doc.fontSize(10).font('Helvetica');
            doc.text("No.", 50, tableTop);
            doc.text("Servicio", 100, tableTop);
            doc.text("Precio", 350, tableTop);
            doc.moveDown(0.5);

            // Servicios
            precio_por_servicio.forEach((servicio, index) => {
                doc.text(index + 1, 50, doc.y);
                doc.text(servicio.nombre, 100, doc.y);
                doc.text(`$${(servicio.precio_neto).toFixed(2)}`, 350, doc.y);
                doc.moveDown(1);
            });

            // Línea divisoria al final
            doc.moveDown(1);
            doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(1);

            // Pie de página (si deseas agregar alguna información adicional)
            doc.fontSize(10).font('Helvetica-Oblique').text("Gracias por su compra. Si tiene alguna consulta, no dude en contactarnos.", { align: "center" });

            doc.end();

            // Actualizar la ruta del PDF en la base de datos
            const queryUpdate = `UPDATE ${this.nombreTabla} SET imagen = ? WHERE numero_folio = ?`;
            await db.execute<ResultSetHeader>(queryUpdate, [relativePdfPath, numeroFolio]);

            const queryInsertService = `INSERT INTO facturas_servicios (numero_folio, nombre, precio_neto) VALUES (?,?,?)`;
            for (const servicio of precio_por_servicio) {
                await db.execute<ResultSetHeader>(queryInsertService, [numeroFolio, servicio.nombre, servicio.precio_neto]);
            }

            const invoiceResult = await this.getById(String(numeroFolio));
            // Devolvemos la factura creada
            return invoiceResult;
        } catch (err) {
            throw err;
        }
    }


    // Obtener por ID
    static async getById(numero_folio: string): Promise<RowDataPacket> {
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


}

export default Invoices;