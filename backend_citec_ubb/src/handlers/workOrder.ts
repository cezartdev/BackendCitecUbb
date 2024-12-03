import { Request, Response } from 'express';
import WorkOrder from "../models/WorkOrder.model";


export const getAll = async (req: Request, res: Response) => {

    try {
        const response = await WorkOrder.getAll();
        res.status(200).json({ msg: "Ordenes de trabajo seleccionadas correctamente", response });
    } catch (err) {
        res.status(500).json({ errors: err.message });
    }
};

export const getAllDeleted = async (req: Request, res: Response) => {
    try {
        const response = await WorkOrder.getAllDeleted();
        res.status(200).json({ msg: "Ordenes de trabajo eliminadas seleccionadas correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const getById = async (req: Request, res: Response) => {
    const id = Number(req.params.numero_folio);
    try {
        const response = await WorkOrder.getById(id);
        res.status(200).json({ msg: "Orden de trabajo seleccionada correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const deleteInvoice = async (req: Request, res: Response) => {
    const numero_folio = Number(req.params.numero_folio);
    try {
        const response = await WorkOrder.delete(numero_folio);
        res.status(200).json({ msg: "Orden de trabajo eliminada correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const updateAllInvoice = async (req: Request, res: Response) => {

    const { numero_folio, pago_neto, iva, rut_receptor, codigo_giro, estado, usuario, precio_por_servicio, exento_iva } = req.body;
    try {
        const response = await WorkOrder.update(numero_folio, pago_neto, iva, rut_receptor, codigo_giro, estado, usuario, exento_iva, precio_por_servicio );
        res.status(201).json({ msg: "Orden de trabajo actualizada correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};