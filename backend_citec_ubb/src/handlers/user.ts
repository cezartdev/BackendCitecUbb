import { Request, Response } from 'express';
import User from "../models/User.model";

export const createUser = async (req: Request, res: Response) => {
    const {email, nombre, apellido, contraseña, tipo } = req.body;
    try {
        const response = await User.create(email, nombre, apellido,contraseña,tipo);
        res.status(200).json({ msg: "Usuario creado correctamente", response });
    } catch (err) {
        res.status(500).json({ msg: "Error al crear el usuario", error: err.message });
    }
};