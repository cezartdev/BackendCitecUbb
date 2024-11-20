import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import ApiKey from "../models/ApiKey.model";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export const handleInputErrors = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
};

export const handlePasswordEncrypt = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const saltRounds = 10;
    const { contraseña } = req.body;

    if (!contraseña) {
        next();
        return;
    }

    try {
        // Genera el hash de la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

        // Reemplaza la contraseña en el cuerpo de la solicitud con el hash
        req.body.contraseña = hashedPassword;

        // Continúa al siguiente middleware o controlador
        next();
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ errors: [{ msg: "Error encriptando la contraseña" }] });
    }
};

// Middleware generalizado para normalizar campos según la configuración
export const normalizeFieldsGeneral =
    (config) => (req: Request, res: Response, next: NextFunction) => {
        // Función auxiliar para normalizar valores de acuerdo a la configuración
        const normalizeField = (value: string, transformation: string) => {
            if (transformation === "lowercase") {
                return value.toLowerCase();
            } else if (transformation === "uppercase") {
                return value.toUpperCase();
            } else if (transformation === "capitalize") {
                return value
                    .split(" ")
                    .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    )
                    .join(" ");
            }
            return value; // Si no se encuentra ninguna transformación, devolver el valor original
        };

        // Iterar sobre la configuración y aplicar las transformaciones en req.body, req.params y req.query
        Object.keys(config).forEach((field) => {
            const transformation = config[field];

            // Normalizar campos en req.body
            if (req.body[field]) {
                req.body[field] = normalizeField(req.body[field], transformation);
            }

            // Normalizar campos en req.params
            if (req.params[field]) {
                req.params[field] = normalizeField(req.params[field], transformation);
            }

            // Normalizar campos en req.query
            if (req.query[field]) {
                req.query[field] = normalizeField(
                    req.query[field] as string,
                    transformation
                );
            }
        });

        next();
    };

export const validateApiKey = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const apiKeyParam = req.params.key;
    // Verificar que el API_KEY esté presente y sea válido
    if (!apiKeyParam) {
        return res
            .status(403)
            .json({ errors: [{ msg: "Acceso denegado: API_KEY inválida" }] });
    }

    try {
        const data = await ApiKey.getById(process.env.FRONTEND_URL);
        const key = data.clave;

        const isValid = await bcrypt.compare(apiKeyParam, key);

        if(!isValid){
            return res
            .status(403)
            .json({ errors: [{ msg: "Acceso denegado: API_KEY inválida" }] });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ errors: [{ msg: "Error interno del servidor" }] });
    }

    next();
};
