import {Router} from "express"
import {body, param} from "express-validator"
import {createBusiness, deleteBusiness, getAll, getById, updateAllBusiness, updatePartialBusiness} from "../handlers/business"
import {handleInputErrors, handlePasswordEncrypt, normalizeFieldsGeneral} from "../middleware/index"

const router = Router();
const rutRegex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/;
const phoneRegex = /^(?:\+569\d{8}|[2-9]\d{8})$/;
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

/**
 * @swagger
 * /api/business/create:
 *      post:
 *          summary: Crear una empresa
 *          tags:
 *              - Empresas
 *          description: Esta ruta se encarga de crear a una empresa
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              rut:
 *                                  type: string
 *                                  example: 77.123.456-7
 *                              razon_social:
 *                                  type: string
 *                                  example: Empresa Spa
 *                              nombre_de_fantasia:
 *                                  type: string
 *                                  example: Construcciones El Pedro
 *                              email_factura:
 *                                  type: string
 *                                  example: factura@gmail.com
 *                              direccion:
 *                                  type: string
 *                                  example: calle o'higgins n°12
 *                              comuna:
 *                                  type: string
 *                                  example: 8103
 *                              telefono:
 *                                  type: string
 *                                  example: +56912345678
 *                              
 *          responses:
 *              201:
 *                  description: Respuesta correcta (Created)
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  msg:
 *                                      type: string
 *                                      example: Empresa creada correctamente
 *                                  response:
 *                                      type: object
 *                                      properties:
 *                                          rut:
 *                                              type: string
 *                                              example: 77.123.456-7
 *                                          razon_social:
 *                                              type: string
 *                                              example: Empresa Spa
 *                                          nombre_de_fantasia:
 *                                              type: string
 *                                              example: Construcciones El Pedro
 *                                          email_factura:
 *                                              type: string
 *                                              example: factura@gmail.com
 *                                          direccion:
 *                                              type: string
 *                                              example: calle o'higgins n°12
 *                                          comuna:
 *                                              type: number
 *                                              example: 8103
 *                                          telefono:
 *                                              type: string
 *                                              example: +56912345678
 *                                          created_at:
 *                                              type: string
 *                                              example: 2024-10-03T19:36:42.000Z
 *                                          
 *              400:
 *                  description: Peticion mal hecha (Bad Request)
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  errors:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              type:
 *                                                  type: string
 *                                                  example: field
 *                                              msg:
 *                                                  type: string 
 *                                                  example: El telefono no está en el formato correcto
 *                                              value:
 *                                                  type: string
 *                                                  example: +..asda
 *                                              path:
 *                                                  type: string
 *                                                  example: telefono
 *                                              location:
 *                                                  type: string
 *                                                  example: body                                          
 *                              
 *              409:
 *                  description: Recurso existente o duplicado (Conflict)
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  errors:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              type:
 *                                                  type: string
 *                                                  example: field
 *                                              msg:
 *                                                  type: string 
 *                                                  example: La empresa que intenta crear ya existe
 *                                              value:
 *                                                  type: string
 *                                                  example: 77.123.456-7
 *                                              path:
 *                                                  type: string
 *                                                  example: rut
 *                                              location:
 *                                                  type: string
 *                                                  example: body
 *                                              
 *         
 */

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


/**
 * @swagger
 * /api/user/delete/{rut}:
 *      delete:
 *          summary: Elimina a una empresa
 *          tags:
 *              - Empresas
 *          description: Esta ruta se encarga de eliminar a una empresa
 *          parameters:
 *            - in: path
 *              name: rut
 *              description: El rut de una empresa
 *              required: true
 *              schema:
 *                  type: string
 *          responses:
 *              200:
 *                  description: Respuesta correcta (OK)
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  msg:
 *                                      type: string
 *                                      example: "Empresa eliminada correctamente"
 *                                  response:
 *                                      type: object
 *                                      properties:
 *                                          rut:
 *                                              type: string
 *                                              example: 77.123.456-7
 *                                          razon_social:
 *                                              type: string
 *                                              example: Empresa Spa
 *                                          nombre_de_fantasia:
 *                                              type: string
 *                                              example: Construcciones El Pedro
 *                                          email_factura:
 *                                              type: string
 *                                              example: factura@gmail.com
 *                                          direccion:
 *                                              type: string
 *                                              example: calle o'higgins n°12
 *                                          comuna:
 *                                              type: number
 *                                              example: 8103
 *                                          telefono:
 *                                              type: string
 *                                              example: +56912345678                                              
 *                                          created_at:
 *                                              type: string
 *                                              example: 2024-10-03T19:36:42.000Z
*              400:
 *                  description: Peticion mal hecha (Bad Request)
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  errors:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              type:
 *                                                  type: string
 *                                                  example: field
 *                                              msg:
 *                                                  type: string 
 *                                                  example: Formato de rut invalido. Debe ser '11.111.111-1'
 *                                              value:
 *                                                  type: string
 *                                                  example: 77.123.456-A
 *                                              path:
 *                                                  type: string
 *                                                  example: rut
 *                                              location:
 *                                                  type: string
 *                                                  example: params                                         
 *              404:
 *                  description: Recurso no encontrado (Not Found)
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  errors:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              type:
 *                                                  type: string
 *                                                  example: field
 *                                              msg:
 *                                                  type: string 
 *                                                  example: La empresa que intenta eliminar no existe
 *                                              value:
 *                                                  type: string
 *                                                  example: 77.123.456-7
 *                                              path:
 *                                                  type: string
 *                                                  example: rut
 *                                              location:
 *                                                  type: string
 *                                                  example: params                                               
 */
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

/**
 * @swagger
 * /api/business/update:
 *      put:
 *          summary: Actualiza a una empresa Totalmente
 *          tags:
 *              - Empresas
 *          description: Esta ruta se encarga de editar o actualizar a las empresas de forma total o completa, es decir, se deben pasar obligatoriamente todos los atributos de la entidad
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              rut:
 *                                  type: string
 *                                  example: 77.123.456-7
 *                              nuevo_rut:
 *                                  type: string
 *                                  example: 77.123.456-8
 *                              razon_social:
 *                                  type: string
 *                                  example: Empresa Spa
 *                              nombre_de_fantasia:
 *                                  type: string
 *                                  example: Construcciones El Pedro
 *                              email_factura:
 *                                  type: string
 *                                  example: factura@gmail.com
 *                              direccion:
 *                                  type: string
 *                                  example: calle o'higgins n°12
 *                              comuna:
 *                                  type: string
 *                                  example: 8103
 *                              telefono:
 *                                  type: string
 *                                  example: 229123457
 *          responses:
 *              200:
 *                  description: Respuesta correcta (OK)
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  msg:
 *                                      type: string
 *                                      example: Empresa Actualizada correctamente
 *                                  response:
 *                                      type: object
 *                                      properties:
 *                                          rut:
 *                                              type: string
 *                                              example: 77.123.456-7
 *                                          razon_social:
 *                                              type: string
 *                                              example: Empresa Spa
 *                                          nombre_de_fantasia:
 *                                              type: string
 *                                              example: Construcciones El Pedro
 *                                          email_factura:
 *                                              type: string
 *                                              example: factura@gmail.com
 *                                          direccion:
 *                                              type: string
 *                                              example: calle o'higgins n°12
 *                                          comuna:
 *                                              type: number
 *                                              example: 8103
 *                                          telefono:
 *                                              type: string
 *                                              example: "+56912345678"
 *                                          created_at:
 *                                              type: string
 *                                              example: 2024-10-03T19:36:42.000Z
*              400:
 *                  description: Peticion mal hecha (Bad Request)
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  errors:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              type:
 *                                                  type: string
 *                                                  example: field
 *                                              msg:
 *                                                  type: string 
 *                                                  example: El telefono no está en el formato correcto
 *                                              value:
 *                                                  type: string
 *                                                  example: 2291234572
 *                                              path:
 *                                                  type: string
 *                                                  example: telefono
 *                                              location:
 *                                                  type: string
 *                                                  example: body                                         
 *              404:
 *                  description: Recurso no encontrado (Not Found)
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  errors:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              type:
 *                                                  type: string
 *                                                  example: field
 *                                              msg:
 *                                                  type: string 
 *                                                  example: La empresa que intenta actualizar no existe
 *                                              value:
 *                                                  type: string
 *                                                  example: 77.123.456-8
 *                                              path:
 *                                                  type: string
 *                                                  example: rut
 *                                              location:
 *                                                  type: string
 *                                                  example: body                                        
 *              409:
 *                  description: Recurso existente o duplicado (Conflict)
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  errors:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              type:
 *                                                  type: string
 *                                                  example: field
 *                                              msg:
 *                                                  type: string 
 *                                                  example: El nuevo rut pertenece a otra empresa
 *                                              value:
 *                                                  type: string
 *                                                  example: 84.976.200-1
 *                                              path:
 *                                                  type: string
 *                                                  example: nuevo_rut
 *                                              location:
 *                                                  type: string
 *                                                  example: body                               
 *                                              
 *         
 */
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