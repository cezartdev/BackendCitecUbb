import { Request, Response } from 'express';
import Region from "../models/Region.model";


export const getAll = async (req: Request, res: Response) => {

    try {
        const response = await Region.getAll();
        res.status(200).json({ msg: "Regiones seleccionadas correctamente", response });
    } catch (err) {
        res.status(500).json({ errors: err.message });
    }
};

export const getById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const response = await Region.getById(id);
        res.status(200).json({ msg: "Region seleccionada correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};