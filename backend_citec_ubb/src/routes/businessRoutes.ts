import {Router} from "express"
import {body, param} from "express-validator"
import {createBusiness, deleteBusiness, getAll,updateAllBusiness} from "../handlers/bussiness"
import {handleInputErrors, handlePasswordEncrypt, normalizeFieldsGeneral} from "../middleware/index"

const router = Router();

// Definir la configuración para las transformaciones
const config = {
    "rut": "lowercase",
    "razon_social": "capitalize",        
    "nombre_de_fantasia": "capitalize",
    "email_factura": "lowercase" ,    
    "direccion": "lowercase",
};
const rutRegex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/;
const phoneRegex = /^(?:\+569\d{8}|[2-9]\d{8})$/;

// POST - Crear una empresa
router.post("/create",
    body("rut")
        .notEmpty().withMessage("El rut esta vacio")
        .isString().withMessage("Tipo de dato incorrecto para el rut")
        .matches(rutRegex).withMessage("Formato de rut invalido. Debe ser '11.111.111-1'"),
    body("razon_social")
        .notEmpty().withMessage("La razon social está vacia")
        .isString().withMessage("Tipo de dato incorrecto para la razon social"),
    body("nombre_de_fantasia")
        .notEmpty().withMessage("El nombre de fantasia esta vacio")
        .isString().withMessage("Tipo de dato incorrecto para el nombre de fantasia"),
    body("email_factura")
        .notEmpty().withMessage("El email de factura esta vacio")
        .isEmail().withMessage("El email de la factura no está en el formato correcto"),
    body("direccion")
        .notEmpty().withMessage("La direccion esta vacia")
        .isString().withMessage("Tipo de dato incorrecto para la direccion"),
    body("comuna")
        .notEmpty().withMessage("La comuna esta vacia")
        .isString().withMessage("Tipo de dato incorrecto para la comuna"),
    body("telefono")
        .notEmpty().withMessage("El telefono está vacío")
        .matches(phoneRegex).withMessage("El telefono no está en el formato correcto"),
    handleInputErrors,
    normalizeFieldsGeneral(config),
    createBusiness);

// DELETE - Eliminar a una empresa
router.delete("/delete/:rut",
        param("rut")
            .notEmpty().withMessage("El rut esta vacio")
            .matches(rutRegex).withMessage("Formato de rut invalido. Debe ser '11.111.111-1'"),
        handleInputErrors,    
        deleteBusiness);

// PUT - Actualización completa de una empresa
router.put("/update", 
    body("rut")
        .notEmpty().withMessage("El rut esta vacio")
        .matches(rutRegex).withMessage("Formato de rut invalido. Debe ser '11.111.111-1'"),
    body("razon_social")
        .notEmpty().withMessage("La razon social está vacia")
        .isString().withMessage("Tipo de dato incorrecto para la razon social"),
    body("nombre_de_fantasia")
        .notEmpty().withMessage("El nombre de fantasia esta vacio")
        .isString().withMessage("Tipo de dato incorrecto para el nombre de fantasia"),
    body("email_factura")
        .notEmpty().withMessage("El email de factura esta vacio")
        .isEmail().withMessage("El email de la factura no está en el formato correcto"),
    body("direccion")
        .notEmpty().withMessage("La direccion esta vacia")
        .isString().withMessage("Tipo de dato incorrecto para la direccion"),
    body("comuna")
        .notEmpty().withMessage("La comuna esta vacia")
        .isString().withMessage("Tipo de dato incorrecto para la comuna"),
    body("telefono")
        .notEmpty().withMessage("El telefono está vacío")
        .matches(phoneRegex).withMessage("El telefono no está en el formato correcto"),
    handleInputErrors,
    normalizeFieldsGeneral(config),
    updateAllBusiness
);
router.get("/get-all", getAll);

export default router;