import { Request, Response } from 'express';
import Type from "../models/Type.model";


export const getAll = async (req: Request, res: Response) => {

    try {
        const response = await Type.getAll();
        res.status(200).json({ msg: "Tipos de usuarios seleccionados correctamente", response });
    } catch (err) {
        res.status(500).json({ errors:err.message });
    }
};

