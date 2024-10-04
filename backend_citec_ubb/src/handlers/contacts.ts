import { Request, Response } from 'express';
import Contacts from "../models/Contacts.model";


export const getAll = async (req: Request, res: Response) => {

    try {
        const response = await Contacts.getAll();
        res.status(200).json({ response });
    } catch (err) {
        res.status(500).json({ errors: err.message });
    }
};

export const getById = async (req: Request, res: Response) => {
    const email = req.params.email;
    try {
        const response = await Contacts.getById(email);
        res.status(200).json({ msg: "contacto seleccionada correctamente", response });
    } catch (err) {
        res.status(500).json({ errors: err.details });
    }
};