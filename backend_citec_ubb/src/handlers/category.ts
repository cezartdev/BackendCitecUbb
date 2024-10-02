import { Request, Response } from 'express';
import Category from "../models/Category.model";


export const getAll = async (req: Request, res: Response) => {

    try {
        const response = await Category.getAll();
        res.status(200).json({ response });
    } catch (err) {
        res.status(500).json({ errors: err.message });
    }
};
