import {Router} from "express"
import {body, param} from "express-validator"
import {createBusiness, deleteBusiness, getAll, getById, updateAllBusiness, updatePartialBusiness} from "../handlers/business"
import {handleInputErrors, handlePasswordEncrypt, normalizeFieldsGeneral} from "../middleware/index"

const router = Router();
/**
* @swagger
* components:
*       schemas:
*           Empresa:
*               type: object
*               properties:
*                   email:
*                       type: string
*                       description: Email del usuario
*                       example: admin@gmail.com
*                   nombre:
*                       type: string
*                       description: El nombre del usuario
*                       example: Juan
*                   apellido:
*                       type: string
*                       description: El apellido del usuario
*                       example: Perez
*                   contraseña:
*                       type: string
*                       description: La contraseña del usuario hasheada
*                       example: 1@.0//as+K
*                   nombre_tipo:
*                       type: string
*                       description: El tipo de usuario
*                       example: gerente
*/

const rutRegex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/;
const phoneRegex = /^(?:\+569\d{8}|[2-9]\d{8})$/;

// Definir la configuración para las transformaciones
const configCreate = {
    "rut": "lowercase",
    "razon_social": "capitalize",        
    "nombre_de_fantasia": "capitalize",
    "email_factura": "lowercase" ,    
    "direccion": "lowercase",
};
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
    normalizeFieldsGeneral(configCreate),
    createBusiness);

const configDelete = {
    "rut": "lowercase",
};
// DELETE - Eliminar a una empresa
router.delete("/delete/:rut",
        param("rut")
            .notEmpty().withMessage("El rut esta vacio")
            .matches(rutRegex).withMessage("Formato de rut invalido. Debe ser '11.111.111-1'"),
        handleInputErrors,
        normalizeFieldsGeneral(configDelete),    
        deleteBusiness);

const configUpdate = {
    "rut": "lowercase",
    "nuevo_rut":"lowercase",
    "razon_social": "capitalize",        
    "nombre_de_fantasia": "capitalize",
    "email_factura": "lowercase" ,    
    "direccion": "lowercase",
};
// PUT - Actualización completa de una empresa
router.put("/update", 
    body("rut")
        .notEmpty().withMessage("El rut esta vacio")
        .matches(rutRegex).withMessage("Formato de rut invalido. Debe ser '11.111.111-1'"),
    body("nuevo_rut")
        .notEmpty().withMessage("El nuevo rut esta vacio")
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
    normalizeFieldsGeneral(configUpdate),
    updateAllBusiness
);

//PATCH - Actualización parcial de una empresa
router.patch("/update",
    body("rut")
        .notEmpty().withMessage("El rut esta vacio")
        .matches(rutRegex).withMessage("Formato de rut invalido. Debe ser '11.111.111-1'"),
    body("nuevo_rut")
        .optional()
        .notEmpty().withMessage("El nuevo rut esta vacio")
        .matches(rutRegex).withMessage("Formato de rut invalido. Debe ser '11.111.111-1'"),
    body("razon_social")
        .optional()
        .notEmpty().withMessage("La razon social está vacia")
        .isString().withMessage("Tipo de dato incorrecto para la razon social"),
    body("nombre_de_fantasia")
        .optional()
        .notEmpty().withMessage("El nombre de fantasia esta vacio")
        .isString().withMessage("Tipo de dato incorrecto para el nombre de fantasia"),
    body("email_factura")
        .optional()
        .notEmpty().withMessage("El email de factura esta vacio")
        .isEmail().withMessage("El email de la factura no está en el formato correcto"),
    body("direccion")
        .optional()
        .notEmpty().withMessage("La direccion esta vacia")
        .isString().withMessage("Tipo de dato incorrecto para la direccion"),
    body("comuna")
        .optional()
        .notEmpty().withMessage("La comuna esta vacia")
        .isString().withMessage("Tipo de dato incorrecto para la comuna"),
    body("telefono")
        .optional()
        .notEmpty().withMessage("El telefono está vacío")
        .matches(phoneRegex).withMessage("El telefono no está en el formato correcto"),
    handleInputErrors,
    normalizeFieldsGeneral(configUpdate),
    updatePartialBusiness);

router.get("/get-all", getAll);

router.get("/get-by-id/:rut",
    param("rut")
        .notEmpty().withMessage("El rut esta vacio")
        .matches(rutRegex).withMessage("Formato de rut invalido. Debe ser '11.111.111-1'"),
    handleInputErrors,
    getById);


export default router;