import { Request, Response } from 'express';
import User from "../models/User.model";

export const createUser = async (req: Request, res: Response) => {
    const {email, nombre, apellido, contraseña, nombre_tipo } = req.body;
    try {
        const response = await User.create(email, nombre, apellido,contraseña,nombre_tipo);
        res.status(200).json({ msg: "Usuario creado correctamente", response});
    } catch (err) {
        res.status(500).json({ errors: err.details });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const response = await User.getAll();
        res.status(200).json({ response });
    } catch (err) {
        res.status(500).json({ errors:err.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const response = await User.delete(id);
        res.status(200).json({msg:"Usuario eliminado exitosamente", response });
    } catch (err) {
        res.status(500).json({ errors:err.details });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const {email, contraseña} = req.body;
    try {
        
        const response = await User.login(email,contraseña);
        res.status(200).json({login_status:true, response });
    } catch (err) {
        res.status(500).json({ errors:err.details });
    }
};