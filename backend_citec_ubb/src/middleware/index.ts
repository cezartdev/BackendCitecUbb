import {Request,Response, NextFunction} from "express"
import { validationResult } from "express-validator"
import bcrypt from "bcrypt";

export const handleInputErrors = async (req: Request,res:Response, next: NextFunction) =>{
    
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    next()
}

export const handlePasswordEncrypt = async (req: Request,res:Response, next: NextFunction) =>{
    
    const saltRounds = 10;
    const { contraseña } = req.body;
    try {
        // Genera el hash de la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, saltRounds);
        
        // Reemplaza la contraseña en el cuerpo de la solicitud con el hash
        req.body.contraseña = hashedPassword;
        
        // Continúa al siguiente middleware o controlador
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ response: {msg:"Error encriptando la contraseña" }});
    }
}

// Middleware generalizado para normalizar campos según la configuración
export const normalizeFieldsGeneral = (config) => (req: Request, res:Response, next: NextFunction) => {
    // Iterar sobre la configuración y aplicar las transformaciones
    Object.keys(config).forEach(field => {
        if (req.body[field]) {
            const transformation = config[field];
            
            // Aplicar la transformación dependiendo del valor en la configuración
            if (transformation === 'lowercase') {
                req.body[field] = req.body[field].toLowerCase();
            } else if (transformation === 'uppercase') {
                req.body[field] = req.body[field].toUpperCase();
            } else if (transformation === 'capitalize') {
                req.body[field] = req.body[field].split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');
            }
        }
    });

    next();
};