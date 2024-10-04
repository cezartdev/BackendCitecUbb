import { Request, Response } from 'express';
import BussinessLine from "../models/BusinessLine.model";


export const getAll = async (req: Request, res: Response) => {

    try {
        const response = await BussinessLine.getAll();
        res.status(200).json({ response });
    } catch (err) {
        res.status(500).json({ errors: err.message });
    }
};

export const getById = async (req: Request, res: Response) => {
    const codigo = Number(req.params.codigo);
    try {
        const response = await BussinessLine.getById(codigo);
        res.status(200).json({ msg: "Giro seleccionada correctamente", response });
    } catch (err) {
        res.status(500).json({ errors: err.details });
    }
};