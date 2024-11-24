import { Request, Response } from 'express';
import Services from "../models/Services.model";

export const createService = async (req: Request, res: Response) => {
    const { nombre } = req.body;
    try {
        const response = await Services.create(nombre);
        res.status(201).json({ msg: "Servicio creado correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const response = await Services.getAll();
        res.status(200).json({ msg: "Servicios activos seleccionados correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const getAllDeleted = async (req: Request, res: Response) => {
    try {
        const response = await Services.getAllDeleted();
        res.status(200).json({ msg: "Servicios eliminados seleccionados correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const getById = async (req: Request, res: Response) => {
    const nombre = req.params.nombre;
    try {
        const response = await Services.getById(nombre);
        res.status(200).json({ msg: "Servicio obtenido correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const deleteService = async (req: Request, res: Response) => {
    const nombre = req.params.nombre;
    try {
        const response = await Services.delete(nombre);
        res.status(200).json({ msg: "Servicio eliminado correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const updateAllService = async (req: Request, res: Response) => {

    const { nombre, nuevo_nombre } = req.body;
    try {
        const response = await Services.update(nombre, nuevo_nombre);
        res.status(201).json({ msg: "Servicio Actualizado correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};
