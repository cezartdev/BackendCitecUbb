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