import { Request, Response } from 'express';
import Region from "../models/first/Region.model";


export const getAll = async (req: Request, res: Response) => {

    try {
        const response = await Region.getAll();
        res.status(200).json({ response });
    } catch (err) {
        res.status(500).json({ errors:err.message });
    }
};

