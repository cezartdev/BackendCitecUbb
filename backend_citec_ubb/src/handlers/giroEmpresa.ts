import { Request, Response } from 'express';
import GiroEmpresa from "../models/GiroEmpresa.model";


export const getAll = async (req: Request, res: Response) => {

    try {
        const response = await GiroEmpresa.getAll();
        res.status(200).json({ response });
    } catch (err) {
        res.status(500).json({ errors: err.message });
    }
};

export const getById = async (req: Request, res: Response) => {
    const rut = req.params.rut;
    try {
        const response = await GiroEmpresa.getById(rut);
        res.status(200).json({ msg: "giro de empresa seleccionada correctamente", response });
    } catch (err) {
        res.status(500).json({ errors: err.details });
    }
};