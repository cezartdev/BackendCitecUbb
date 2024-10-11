import { Request, Response } from 'express';
import Contacts from "../models/Contacts.model";


export const createContact = async (req: Request, res: Response) => {
    const { email, nombre, cargo, rut_empresa } = req.body;
    try {
        const response = await Contacts.create(email, nombre, cargo, rut_empresa);
        res.status(201).json({ msg: "Contacto creada correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

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
        res.status(200).json({ msg: "contacto seleccionado correctamente", response });
    } catch (err) {
        res.status(500).json({ errors: err.details });
    }
};

export const deleteContact = async (req: Request, res: Response) => {
    const email = req.params.email;
    try {
        const response = await Contacts.delete(email);
        res.status(200).json({ msg: "contacto eliminado correctamente", response });
    } catch (err) {
        res.status(500).json({ errors: err.details });
    }
};

export const updateAllContact = async (req: Request, res: Response) => {

    const { email, nuevo_email, nombre, cargo, rut_empresa } = req.body;
    try {
        const response = await Contacts.update(email, nuevo_email, nombre, cargo, rut_empresa);
        res.status(201).json({ msg: "contacto actualizado correctamente", response });
    } catch (err) {
        res.status(500).json({ errors: err.details });
    }
};

export const updatePartialContact = async (req: Request, res: Response) => {

    const { email, nuevo_email, nombre, cargo, rut_empresa } = req.body;
    try {
        const response = await Contacts.update(email, nuevo_email, nombre, cargo, rut_empresa);
        res.status(201).json({ msg: "contacto actualizado correctamente", response });
    } catch (err) {
        res.status(500).json({ errors: err.details });
    }
};



