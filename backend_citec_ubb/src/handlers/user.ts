import { Request, Response } from 'express';
import User from "../models/User.model";

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        const result = await User.create(name, email, password);
        res.status(200).json({ msg: "Usuario creado correctamente", result });
    } catch (err) {
        res.status(500).json({ msg: "Error al crear el usuario", error: err.message });
    }
};