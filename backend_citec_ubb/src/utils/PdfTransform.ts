import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// Ensure the directories exist
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};

export const PdfTransformInvoice = (numeroFolio, pago_neto, iva, rut_emisor, rut_receptor, nombreGiro, usuario, exento_iva, precio_por_servicio) => {
    const relativePdfPath = path.posix.join("pdf", "invoices", `factura_${numeroFolio}.pdf`);
    const absolutePdfPath = path.join(__dirname, "..", "../", relativePdfPath);
    ensureDirectoryExistence(absolutePdfPath);
    const fecha = new Date().toISOString().split("T")[0];
    const doc = new PDFDocument({ margin: 50 });
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
    doc.text(`Exento de iva: ${exento_iva.toLocaleUpperCase()}`, { align: "left" });
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

    return relativePdfPath;
}


export const PdfTransformWorkOrder= (numeroFolio, pago_neto, iva, rut_emisor, rut_receptor, nombreGiro, usuario, exento_iva, precio_por_servicio) => {
    const relativePdfPath = path.posix.join("pdf", "workOrders", `workOrder_${numeroFolio}.pdf`);
    const absolutePdfPath = path.join(__dirname, "..", "../", relativePdfPath);
    ensureDirectoryExistence(absolutePdfPath);
    const fecha = new Date().toISOString().split("T")[0];
    const doc = new PDFDocument({ margin: 50 });
    const total = pago_neto + iva;
    doc.pipe(fs.createWriteStream(absolutePdfPath));
    // Agregar logotipo (si lo tienes)
    // doc.image("ruta/del/logotipo.png", 50, 50, { width: 100 });

    // Título de la orden de trabajo
    doc.fontSize(24).font('Helvetica-Bold').text("Orden de Trabajo", { align: "center" });
    doc.moveDown(1);

    // Sección del número de folio (en esquina superior derecha, negrita)
    doc.fontSize(16).font('Helvetica-Bold').text(`Folio N°${numeroFolio}`, { align: "right" });
    doc.moveDown(1);

    // Información de la orden de trabajo (con un diseño más limpio)
    doc.fontSize(12).font('Helvetica').text(`Fecha: ${fecha}`, { align: "left" });
    doc.text(`Emisor: ${rut_emisor}`, { align: "left" });
    doc.text(`RUT Receptor: ${rut_receptor}`, { align: "left" });
    doc.text(`Giro: ${nombreGiro}`, { align: "left" });
    doc.text(`Generado por: ${usuario}`, { align: "left" });
    doc.text(`Exento de iva: ${exento_iva.toLocaleUpperCase()}`, { align: "left" });
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
}