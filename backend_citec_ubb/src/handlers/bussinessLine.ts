import { Request, Response } from 'express';
import BussinessLine from "../models/BussinessLine.model";


export const getAll = async (req: Request, res: Response) => {

    try {
        const response = await BussinessLine.getAll();
        res.status(200).json({ response });
    } catch (err) {
        res.status(500).json({ errors: err.message });
    }
};
