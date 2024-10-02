import { Request, Response } from 'express';
import Commune from "../models/Commune.model";


export const getAll = async (req: Request, res: Response) => {

    try {
        const response = await Commune.getAll();
        res.status(200).json({msg:"Comunas seleccionadas correctamente", response });
    } catch (err) {
        res.status(500).json({ errors:err.message });
    }
};

export const getById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const response = await Commune.getById(id);
        res.status(200).json({msg: "Comuna seleccionada correctamente", response });
    } catch (err) {
        res.status(500).json({ errors:err.details });
    }
};