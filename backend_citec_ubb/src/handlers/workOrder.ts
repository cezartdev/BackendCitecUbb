import { Request, Response } from 'express';
import WorkOrder from "../models/WorkOrder.model";

export const createWorkOrder = async (req: Request, res: Response) => {
    const { numero_folio, observacion, cliente, direccion, provincia, comuna, descripcion, servicios } = req.body;
    try {
        const response = await WorkOrder.create(numero_folio, observacion, cliente, direccion, provincia, comuna, descripcion, servicios);
        res.status(201).json({ msg: "Orden de trabajo creada correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

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

export const deleteWorkOrder = async (req: Request, res: Response) => {
    const numero_folio = Number(req.params.numero_folio);
    try {
        const response = await WorkOrder.delete(numero_folio);
        res.status(200).json({ msg: "Orden de trabajo eliminada correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const updateAllWorkOrder = async (req: Request, res: Response) => {

    const { numero_folio, observacion, cliente, direccion, provincia, comuna, estado, descripcion, servicios } = req.body;
    try {
        const response = await WorkOrder.update(numero_folio, observacion, cliente, direccion, provincia, comuna, estado, descripcion, servicios );
        res.status(201).json({ msg: "Orden de trabajo actualizada correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};