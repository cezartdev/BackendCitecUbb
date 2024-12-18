import { Request, Response } from 'express';
import Business from "../models/Business.model";

export const createBusiness = async (req: Request, res: Response) => {
    const { rut, razon_social, nombre_de_fantasia, email_factura, direccion, comuna, telefono, contactos, giros} = req.body;
    try {
        const response = await Business.create(rut, razon_social, nombre_de_fantasia, email_factura, direccion, comuna, telefono, contactos, giros);
        res.status(201).json({ msg: "Empresa creada correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const response = await Business.getAll();
        res.status(200).json({ msg: "Empresas seleccionadas correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const getById = async (req: Request, res: Response) => {
    const rut = req.params.rut;
    try {
        const response = await Business.getById(rut);
        res.status(200).json({ msg: "Empresa obtenida correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const deleteBusiness = async (req: Request, res: Response) => {
    const rut = req.params.rut;
    try {
        const response = await Business.delete(rut);
        res.status(200).json({ msg: "Empresa eliminada correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const updateAllBusiness = async (req: Request, res: Response) => {

    const { rut, nuevo_rut, razon_social, nombre_de_fantasia, email_factura, direccion, comuna, telefono, contactos, giros } = req.body;
    try {
        const response = await Business.update(rut, nuevo_rut, razon_social, nombre_de_fantasia, email_factura, direccion, comuna, telefono, contactos, giros);
        res.status(201).json({ msg: "Empresa Actualizada correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const updatePartialBusiness = async (req: Request, res: Response) => {

    const { rut, nuevo_rut, razon_social, nombre_de_fantasia, email_factura, direccion, comuna, telefono, contactos, giros } = req.body;
    try {
        const response = await Business.partialUpdate(rut, { nuevo_rut, razon_social, nombre_de_fantasia, email_factura, direccion, comuna, telefono, contactos, giros });
        res.status(200).json({ msg: "Empresa Actualizada correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};