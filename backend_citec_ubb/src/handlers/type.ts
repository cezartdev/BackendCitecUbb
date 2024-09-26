import { Request, Response } from 'express';
import Type from "../models/first/Type.model";


export const getAll = async (req: Request, res: Response) => {

    try {
        const response = await Type.getAll();
        res.status(200).json({ response });
    } catch (err) {
        res.status(500).json({ errors:err.message });
    }
};
