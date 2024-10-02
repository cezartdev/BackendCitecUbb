import { Request, Response } from 'express';
import Province from "../models/Province.model";


export const getAll = async (req: Request, res: Response) => {

    try {
        const response = await Province.getAll();
        res.status(200).json({ msg:"Provincias seleccionadas correctamente", response });
    } catch (err) {
        res.status(500).json({ errors: err.message });
    }
};

export const getById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const response = await Province.getById(id);
        res.status(200).json({ msg: "Provincia seleccionada correctamente", response });
    } catch (err) {
        res.status(500).json({ errors: err.details });
    }
};