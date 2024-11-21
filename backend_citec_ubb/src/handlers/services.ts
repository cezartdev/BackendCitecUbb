import { Request, Response } from 'express';
import Services from "../models/Services.model";

export const createService = async (req: Request, res: Response) => {
    const { nombre } = req.body;
    try {
        const response = await Services.create(nombre);
        res.status(201).json({ msg: "Servicio creado correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const response = await Services.getAll();
        res.status(200).json({ msg: "Servicios seleccionados correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

export const getById = async (req: Request, res: Response) => {
    const nombre = req.params.nombre;
    try {
        const response = await Services.getById(nombre);
        res.status(200).json({ msg: "Servicio obtenido correctamente", response });
    } catch (err) {
        const errorCode = err.code || 500;
        res.status(errorCode).json({ errors: err.details });
    }
};

// export const deleteBusiness = async (req: Request, res: Response) => {
//     const rut = req.params.rut;
//     try {
//         const response = await Services.delete(rut);
//         res.status(200).json({ msg: "Empresa eliminada correctamente", response });
//     } catch (err) {
//         const errorCode = err.code || 500;
//         res.status(errorCode).json({ errors: err.details });
//     }
// };

// export const updateAllBusiness = async (req: Request, res: Response) => {

//     const { rut, nuevo_rut, razon_social, nombre_de_fantasia, email_factura, direccion, comuna, telefono, contactos, giros } = req.body;
//     try {
//         const response = await Services.update(rut, nuevo_rut, razon_social, nombre_de_fantasia, email_factura, direccion, comuna, telefono, contactos, giros);
//         res.status(201).json({ msg: "Empresa Actualizada correctamente", response });
//     } catch (err) {
//         const errorCode = err.code || 500;
//         res.status(errorCode).json({ errors: err.details });
//     }
// };
