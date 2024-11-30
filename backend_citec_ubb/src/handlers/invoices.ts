import { Request, Response } from 'express';
import Invoice from "../models/Invoices.model";

export const createInvoice = async (req: Request, res: Response) => {
    const { pago_neto, iva, rut_receptor, codigo_giro, servicios, usuario, precio_por_servicio } = req.body;
    try {
        const response = await Invoice.create(pago_neto, iva, rut_receptor, codigo_giro, usuario, precio_por_servicio);
        res.status(201).json({ msg: "Factura creada correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const response = await Invoice.getAll();
        res.status(200).json({ msg: "Facturas activas seleccionadas correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const getAllDeleted = async (req: Request, res: Response) => {
    try {
        const response = await Invoice.getAllDeleted();
        res.status(200).json({ msg: "Facturas eliminadas seleccionadas correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const getById = async (req: Request, res: Response) => {
    const numero_folio = Number(req.params.numero_folio);
    try {
        const response = await Invoice.getById(numero_folio);
        res.status(200).json({ msg: "Factura obtenida correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const deleteInvoice = async (req: Request, res: Response) => {
    const numero_folio = Number(req.params.numero_folio);
    try {
        const response = await Invoice.delete(numero_folio);
        res.status(200).json({ msg: "Factura eliminada correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const updateAllInvoice = async (req: Request, res: Response) => {

    const { numero_folio, pago_neto, iva, rut_receptor, codigo_giro, estado, usuario, precio_por_servicio } = req.body;
    try {
        const response = await Invoice.update(numero_folio, pago_neto, iva, rut_receptor, codigo_giro, estado, usuario, precio_por_servicio );
        res.status(201).json({ msg: "Factura Actualizada correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};
