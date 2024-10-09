import { Router } from "express"
import { body, param } from "express-validator"
import { handleInputErrors, normalizeFieldsGeneral } from "../middleware/index"
import { createContact, getAll, getById, updateAllContact, updatePartialContact, deleteContact } from "../handlers/contacts"

const router = Router();
const rutRegex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/;

/**
 * @swagger
 * components:
 *   schemas:
 *     Contacto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: Email del contacto
 *           example: contacto@empresa.com
 *         nombre:
 *           type: string
 *           description: El nombre del contacto
 *           example: Ana
 *         cargo:
 *           type: string
 *           description: Cargo del contacto en la empresa
 *           example: Gerente de Ventas
 *         rut_empresa:
 *           type: string
 *           description: RUT de la empresa del contacto
 *           example: 12.345.678-9
 */

/**
 * @swagger
 * /api/contact/create:
 *      post:
 *          summary: Crear un contacto
 *          tags:
 *              - Contactos
 *          description: Esta ruta se encarga de crear un contacto asociado a una empresa
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  example: contacto@empresa.com
 *                              nombre:
 *                                  type: string
 *                                  example: Ana
 *                              cargo:
 *                                  type: string
 *                                  example: Gerente de Ventas
 *                              rut_empresa:
 *                                  type: string
 *                                  example: 77.123.456-7
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
 *                                      example: Contacto creado correctamente
 *                                  response:
 *                                      type: object
 *                                      properties:
 *                                          email:
 *                                              type: string
 *                                              example: contacto@empresa.com
 *                                          nombre:
 *                                              type: string
 *                                              example: Ana
 *                                          cargo:
 *                                              type: string
 *                                              example: Gerente de Ventas
 *                                          rut_empresa:
 *                                              type: string
 *                                              example: 77.123.456-7
 *              400:
 *                  description: Petición mal hecha (Bad Request)
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
 *                                                  example: El email no está en el formato correcto
 *                                              value:
 *                                                  type: string
 *                                                  example: contactoempresa.om
 *                                              path:
 *                                                  type: string
 *                                                  example: email
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
 *                                                  example: El contacto que intenta crear ya existe
 *                                              value:
 *                                                  type: string
 *                                                  example: contacto@empresa.com
 *                                              path:
 *                                                  type: string
 *                                                  example: email
 *                                              location:
 *                                                  type: string
 *                                                  example: body
 */

// Definir la configuración para las transformaciones
const configCreate = {
    "email": "lowercase",
    "nombre": "capitalize",
    "cargo": "capitalize",
    "rut_empresa": "lowercase",
};
// POST - Crear un contacto
router.post("/create",
    body("email")
        .notEmpty().withMessage("El email está vacio")
        .isEmail().withMessage("Tipo de dato incorrecto para el email"),
    body("nombre")
        .notEmpty().withMessage("El nombre esta vacio")
        .isString().withMessage("Tipo de dato incorrecto para el nombre"),
    body("cargo")
        .notEmpty().withMessage("El cargo esta vacio")
        .isString().withMessage("El cargo no está en el formato correcto"),
    body("rut_empresa")
        .notEmpty().withMessage("El rut esta vacio")
        .isString().withMessage("Tipo de dato incorrecto para el rut")
        .matches(rutRegex).withMessage("Formato de rut invalido. Debe ser '11.111.111-1'"),
    handleInputErrors,
    normalizeFieldsGeneral(configCreate),
    createContact);


/**
 * @swagger
 * /api/contact/delete/{email}:
 *      delete:
 *          summary: Elimina un contacto
 *          tags:
 *              - Contactos
 *          description: Esta ruta se encarga de eliminar un contacto asociado a una empresa mediante su email
 *          parameters:
 *            - in: path
 *              name: email
 *              description: El email del contacto a eliminar
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
 *                                      example: "Contacto eliminado correctamente"
 *                                  response:
 *                                      type: object
 *                                      properties:
 *                                          email:
 *                                              type: string
 *                                              example: contacto@empresa.com
 *                                          nombre:
 *                                              type: string
 *                                              example: Ana
 *                                          cargo:
 *                                              type: string
 *                                              example: Gerente de Ventas
 *                                          rut_empresa:
 *                                              type: string
 *                                              example: 77.123.456-7
 *                                          deleted_at:
 *                                              type: string
 *                                              example: 2024-10-03T19:36:42.000Z
 *              
 *              400:
 *                  description: Petición mal hecha (Bad Request)
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
 *                                                  example: Formato de email inválido. Debe ser 'usuario@dominio.com'
 *                                              value:
 *                                                  type: string
 *                                                  example: contactoempresa.om
 *                                              path:
 *                                                  type: string
 *                                                  example: email
 *                                              location:
 *                                                  type: string
 *                                                  example: params
 *              
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
 *                                                  example: El contacto que intenta eliminar no existe
 *                                              value:
 *                                                  type: string
 *                                                  example: contacto@empresa.com
 *                                              path:
 *                                                  type: string
 *                                                  example: email
 */

const configDelete = {
    "email": "lowercase",
};
// DELETE - Eliminar a un contacto
router.delete("/delete/:email",
    param("email")
        .notEmpty().withMessage("El email está vacio")
        .isEmail().withMessage("Tipo de dato incorrecto para el email"),
    handleInputErrors,
    normalizeFieldsGeneral(configDelete),
    deleteContact);


router.get("/get-all", getAll)
router.get("/get-by-id/:email",
    param("email")
        .notEmpty().withMessage("El email no puede estar vacio")
        .isEmail().withMessage("Tipo de dato incorrecto para el email"),
    getById);



/**
 * @swagger
 * /api/contact/update:
 *      put:
 *          summary: Actualiza un contacto
 *          tags:
 *              - Contactos
 *          description: Esta ruta se encarga de editar o actualizar los contactos de forma total o completa, es decir, se deben pasar obligatoriamente todos los atributos de la entidad
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  example: contacto@empresa.com
 *                              nombre:
 *                                  type: string
 *                                  example: Ana
 *                              cargo:
 *                                  type: string
 *                                  example: Gerente de Ventas
 *                              rut_empresa:
 *                                  type: string
 *                                  example: 77.123.456-7
 *                              telefono:
 *                                  type: string
 *                                  example: +56912345678
 *          
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
 *                                      example: "Contacto actualizado correctamente"
 *                                  response:
 *                                      type: object
 *                                      properties:
 *                                          email:
 *                                              type: string
 *                                              example: contacto@empresa.com
 *                                          nombre:
 *                                              type: string
 *                                              example: Ana
 *                                          cargo:
 *                                              type: string
 *                                              example: Gerente de Ventas
 *                                          rut_empresa:
 *                                              type: string
 *                                              example: 77.123.456-7
 *                                          updated_at:
 *                                              type: string
 *                                              example: 2024-10-03T19:36:42.000Z
 *              
 *              400:
 *                  description: Petición mal hecha (Bad Request)
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
 *                                                  example: Formato de email inválido. Debe ser 'usuario@dominio.com'
 *                                              value:
 *                                                  type: string
 *                                                  example: contactoempresa.om
 *                                              path:
 *                                                  type: string
 *                                                  example: email
 *                                              location:
 *                                                  type: string
 *                                                  example: body
 *              
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
 *                                                  example: El contacto que intenta actualizar no existe
 *                                              value:
 *                                                  type: string
 *                                                  example: contacto@empresa.com
 *                                              path:
 *                                                  type: string
 *                                                  example: email
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
 *                                                  example: El email ya está asociado a otro contacto
 *                                              value:
 *                                                  type: string
 *                                                  example: contacto@empresa.com
 *                                              path:
 *                                                  type: string
 *                                                  example: email
 *                                              location:
 *                                                  type: string
 *                                                  example: body
 */

const configUpdate = {
    "email": "lowercase",
    "nuevo_email": "lowercase",
    "nombre": "capitalize",
    "cargo": "capitalize",
    "rut_empresa": "lowercase",
};
// PUT - Actualización completa de una empresa
router.put("/update",
    body("email")
        .notEmpty().withMessage("El email está vacio")
        .isEmail().withMessage("Tipo de dato incorrecto para el email"),
    body("nuevo_email")
        .notEmpty().withMessage("El nuevo email está vacio")
        .isEmail().withMessage("Tipo de dato incorrecto para el nuevo email"),
    body("nombre")
        .notEmpty().withMessage("El nombre esta vacio")
        .isString().withMessage("Tipo de dato incorrecto para el nombre"),
    body("cargo")
        .notEmpty().withMessage("El cargo esta vacio")
        .isString().withMessage("El cargo no está en el formato correcto"),
    body("rut_empresa")
        .notEmpty().withMessage("El rut esta vacio")
        .isString().withMessage("Tipo de dato incorrecto para el rut")
        .matches(rutRegex).withMessage("Formato de rut invalido. Debe ser '11.111.111-1'"),
    handleInputErrors,
    normalizeFieldsGeneral(configUpdate),
    updateAllContact
);

//PATCH - Actualización parcial de una empresa
router.patch("/update",
    body("email")
        .notEmpty().withMessage("El email está vacio")
        .isEmail().withMessage("Tipo de dato incorrecto para el email"),
    body("nuevo_email")
        .notEmpty().withMessage("El nuevo email está vacio")
        .isEmail().withMessage("Tipo de dato incorrecto para el nuevo email"),
    body("nombre")
        .notEmpty().withMessage("El nombre esta vacio")
        .isString().withMessage("Tipo de dato incorrecto para el nombre"),
    body("cargo")
        .notEmpty().withMessage("El cargo esta vacio")
        .isString().withMessage("El cargo no está en el formato correcto"),
    body("rut_empresa")
        .notEmpty().withMessage("El rut esta vacio")
        .isString().withMessage("Tipo de dato incorrecto para el rut")
        .matches(rutRegex).withMessage("Formato de rut invalido. Debe ser '11.111.111-1'"),
    handleInputErrors,
    normalizeFieldsGeneral(configUpdate),
    updatePartialContact);



export default router;