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
    const { password } = req.body;
    try {
        // Genera el hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Reemplaza la contraseña en el cuerpo de la solicitud con el hash
        req.body.password = hashedPassword;
        
        // Continúa al siguiente middleware o controlador
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ response: {msg:"Error encrypting password" }});
    }
}