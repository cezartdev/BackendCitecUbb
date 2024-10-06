import {Router} from "express"
import {body, param} from "express-validator"
import {createUser, loginUser, getAll, deleteUser, updateAllUser, getById, updatePartialUser} from "../handlers/user"
import {handleInputErrors, handlePasswordEncrypt, normalizeFieldsGeneral} from "../middleware/index"

const router = Router();

/**
* @swagger
* components:
*       schemas:
*           Usuario:
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
 * /api/user/create:
 *      post:
 *          summary: Crea al usuario
 *          tags:
 *              - Usuarios
 *          description: Esta ruta se encarga de crear al usuario y encriptar la contraseña
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  example: usuariodeprueba@gmail.com
 *                              nombre:
 *                                  type: string
 *                                  example: Juan
 *                              apellido:
 *                                  type: string
 *                                  example: Perez
 *                              contraseña:
 *                                  type: string
 *                                  example: 1234
 *                              nombre_tipo:
 *                                  type: string
 *                                  example: usuario
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
 *                                      example: Usuario creado correctamente
 *                                  response:
 *                                      type: object
 *                                      properties:
 *                                          email:
 *                                              type: string
 *                                              example: usuariodeprueba@gmail.com
 *                                          nombre:
 *                                              type: string
 *                                              example: Juan
 *                                          apellido:
 *                                              type: string
 *                                              example: Perez
 *                                          contraseña:
 *                                              type: string
 *                                              example: $2b$10$J2fz4f/JDVa9sE5
 *                                          nombre_tipo:
 *                                              type: string
 *                                              example: usuario
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
 *                                                  example: El email no está en el formato correcto
 *                                              value:
 *                                                  type: string
 *                                                  example: usuariodeprueba@gmail.
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
 *                                                  example: El usuario que intenta crear ya existe
 *                                              value:
 *                                                  type: string
 *                                                  example: usuariodeprueba@gmail.com
 *                                              path:
 *                                                  type: string
 *                                                  example: email
 *                                              location:
 *                                                  type: string
 *                                                  example: body
 *                                              
 *         
 */
const configCreate = {
    "email": "lowercase",
    "nombre": "capitalize",
    "apellido": "capitalize",     
    "nombre_tipo": "lowercase"
};
router.post("/create",
    body("email")
        .notEmpty().withMessage("El email esta vacío")
        .isEmail().withMessage("El email no está en el formato correcto"),
    body("nombre")
        .notEmpty().withMessage("El nombre esta vacío")
        .isString().withMessage("El tipo debe ser una cadena de caracteres"),
    body("apellido")
        .notEmpty().withMessage("El apellido está vacio")
        .isString().withMessage("El tipo debe ser una cadena de caracteres"),
    body("contraseña")
        .notEmpty().withMessage("La contraseña no puede estar vacia"),
    body("nombre_tipo")
        .notEmpty().withMessage("El tipo esta vacío")
        .isString().withMessage("El tipo debe ser una cadena de caracteres"),
    handleInputErrors,
    handlePasswordEncrypt,
    normalizeFieldsGeneral(configCreate),
    createUser) ;

/**
 * @swagger
 * /api/user/login:
 *      post:
 *          summary: Ingresa al usuario en la plataforma
 *          tags:
 *              - Usuarios
 *          description: Esta ruta se encarga de loguear al usuario
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  example: usuariodeprueba@gmail.com
 *                              contraseña:
 *                                  type: string
 *                                  example: 1234
 *          responses:
 *              200:
 *                  description: Respuesta correcta (OK)
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  login_status:
 *                                      type: boolean
 *                                      example: true
 *                                  response:
 *                                      type: object
 *                                      properties:
 *                                          email:
 *                                              type: string
 *                                              example: usuariodeprueba@gmail.com
 *                                          nombre:
 *                                              type: string
 *                                              example: Juan
 *                                          apellido:
 *                                              type: string
 *                                              example: Perez
 *                                          contraseña:
 *                                              type: string
 *                                              example: 1234
 *                                          nombre_tipo:
 *                                              type: string
 *                                              example: usuario
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
 *                                                  example: El email no está en el formato correcto
 *                                              value:
 *                                                  type: string
 *                                                  example: usuariodeprueba@gmail.
 *                                              path:
 *                                                  type: string
 *                                                  example: email
 *                                              location:
 *                                                  type: string
 *                                                  example: body                                          
 *                              
 *                                              
 *         
 */
router.post("/login",
    body("email")
        .notEmpty().withMessage("El email esta vacío")
        .isEmail().withMessage("El email no está en el formato correcto"),
    body("contraseña")
        .notEmpty().withMessage("La contraseña está vacía"),
    handleInputErrors,
    loginUser);


/**
 * @swagger
 * /api/user/get-all:
 *      get:
 *          summary: Obtiene a todos los usuarios en un arreglo de objetos
 *          tags:
 *              - Usuarios
 *          description: Esta ruta se encarga de devolver a los usuarios con todos sus propiedades en un arreglo de objetos

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
 *                                      example: "Usuarios seleccionados correctamente"
 *                                  response:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                               email:
 *                                                  type: string
 *                                                  example: usuariodeprueba2@gmail.com
 *                                               nombre:
 *                                                  type: string
 *                                                  example: Juan
 *                                               apellido:
 *                                                  type: string
 *                                                  example: Perez
 *                                               contraseña:
 *                                                  type: string
 *                                                  example: $10$eEup0yWKqFiyP
 *                                               nombre_tipo:
 *                                                  type: string
 *                                                  example: usuario
 *                                               created_at:
 *                                                  type: string
 *                                                  example: 2024-09-29T22:35:16.000Z                                           
 *                                              
 *                                              
 *                                                  
 *              500:
 *                  description: Error interno (Internal Server Error)
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
 *                                              msg:
 *                                                  type: string 
 *                                                  example: No se sabe como manejar la solicitud
                                        
 *                                 
 */
router.get("/get-all", getAll);

/**
 * @swagger
 * /api/user/get-by-id/{email}:
 *      get:
 *          summary: Obtiene a un usuario segun su email
 *          tags:
 *              - Usuarios
 *          description: Esta ruta se encarga de devolver a un usuario con todos sus propiedades en un objeto
 *          parameters:
 *            - in: path
 *              name: email
 *              description: El correo del usuario
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
 *                                      example: "Usuario seleccionado correctamente"
 *                                  response:
 *                                          type: object
 *                                          properties:
 *                                               email:
 *                                                  type: string
 *                                                  example: usuariodeprueba2@gmail.com
 *                                               nombre:
 *                                                  type: string
 *                                                  example: Juan
 *                                               apellido:
 *                                                  type: string
 *                                                  example: Perez
 *                                               contraseña:
 *                                                  type: string
 *                                                  example: $10$eEup0yWKqFiyP
 *                                               nombre_tipo:
 *                                                  type: string
 *                                                  example: usuario
 *                                               created_at:
 *                                                  type: string
 *                                                  example: 2024-09-29T22:35:16.000Z                                           
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
 *                                                  example: El email no está en el formato correcto
 *                                              value:
 *                                                  type: string
 *                                                  example: usuariodeprueba@gmail.
 *                                              path:
 *                                                  type: string
 *                                                  example: email
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
 *                                                  example: El usuario que intenta actualizar no existe
 *                                              value:
 *                                                  type: string
 *                                                  example: usuariodeprueba@gmail.com
 *                                              path:
 *                                                  type: string
 *                                                  example: email
 *                                              location:
 *                                                  type: string
 *                                                  example: params                                                                              
 *                                 
 */
const configById = {
    "email": "lowercase"
};
router.get("/get-by-id/:email",
    param("email")
        .notEmpty().withMessage("El email está vacio")
        .isEmail().withMessage("El email no está en el formato correcto"),
    handleInputErrors,
    normalizeFieldsGeneral(configById),
    getById);
/**
 * @swagger
 * /api/user/update:
 *      put:
 *          summary: Actualiza al usuario Totalmente
 *          tags:
 *              - Usuarios
 *          description: Esta ruta se encarga de editar o actualizar a los usuarios de forma total o completa
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  example: usuariodeprueba@gmail.com
 *                              nuevo_email:
 *                                  type: string
 *                                  example: usuariodeprueba2@gmail.com
 *                              nombre:
 *                                  type: string
 *                                  example: Pablo
 *                              apellido:
 *                                  type: string
 *                                  example: Diaz
 *                              contraseña:
 *                                  type: string
 *                                  example: hola mundo
 *                              nombre_tipo:
 *                                  type: string
 *                                  example: usuario
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
 *                                      example: Usuario Actualizado correctamente
 *                                  response:
 *                                      type: object
 *                                      properties:
 *                                          email:
 *                                              type: string
 *                                              example: usuariodeprueba2@gmail.com
 *                                          nombre:
 *                                              type: string
 *                                              example: Pablo
 *                                          apellido:
 *                                              type: string
 *                                              example: Diaz
 *                                          contraseña:
 *                                              type: string
 *                                              example: OplUjD3N9YyddHq
 *                                          nombre_tipo:
 *                                              type: string
 *                                              example: usuario
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
 *                                                  example: El email no está en el formato correcto
 *                                              value:
 *                                                  type: string
 *                                                  example: usuariodeprueba@gmail.
 *                                              path:
 *                                                  type: string
 *                                                  example: email
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
 *                                                  example: El usuario que intenta actualizar no existe
 *                                              value:
 *                                                  type: string
 *                                                  example: usuariodeprueba@gmail.com
 *                                              path:
 *                                                  type: string
 *                                                  example: email
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
 *                                                  example: El nuevo email pertenece a otro usuario
 *                                              value:
 *                                                  type: string
 *                                                  example: usuariodeprueba@gmail.com
 *                                              path:
 *                                                  type: string
 *                                                  example: nuevo_email
 *                                              location:
 *                                                  type: string
 *                                                  example: body                               
 *                                              
 *         
 */
const configUpdate = {
    "email": "lowercase",
    "nuevo_email": "lowercase",
    "nombre": "capitalize",
    "apellido": "capitalize",     
    "nombre_tipo": "lowercase"
};
router.put("/update",
    body("email")
        .notEmpty().withMessage("El email esta vacío")
        .isEmail().withMessage("El email no está en el formato correcto"),
    body("nuevo_email")
        .notEmpty().withMessage("El nuevo email esta vacío")
        .isEmail().withMessage("El nuevo email no está en el formato correcto"),
    body("nombre")
        .notEmpty().withMessage("El nombre esta vacío")
        .isString().withMessage("El tipo debe ser una cadena de caracteres"),
    body("apellido")
        .notEmpty().withMessage("El apellido está vacio")
        .isString().withMessage("El tipo debe ser una cadena de caracteres"),
    body("contraseña")
        .notEmpty().withMessage("La contraseña no puede estar vacia"),
    body("nombre_tipo")
        .notEmpty().withMessage("El tipo esta vacío")
        .isString().withMessage("El tipo debe ser una cadena de caracteres"),
    handleInputErrors,
    handlePasswordEncrypt,
    normalizeFieldsGeneral(configUpdate),
    updateAllUser);
/**
 * @swagger
 * /api/user/update:
 *      patch:
 *          summary: Actualiza al usuario parcialmente
 *          tags:
 *              - Usuarios
 *          description: Esta ruta se encarga de editar o actualizar a los usuarios de forma parcial
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  example: usuariodeprueba@gmail.com
 *                              contraseña:
 *                                  type: string
 *                                  example: hola mundo
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
 *                                      example: "Usuario Actualizado correctamente"
 *                                  response:
 *                                      type: object
 *                                      properties:
 *                                          email:
 *                                              type: string
 *                                              example: usuariodeprueba@gmail.com
 *                                          nombre:
 *                                              type: string
 *                                              example: Juan
 *                                          apellido:
 *                                              type: string
 *                                              example: Perez
 *                                          contraseña:
 *                                              type: string
 *                                              example: Bg9e869i2/eTl
 *                                          nombre_tipo:
 *                                              type: string
 *                                              example: usuario
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
 *                                                  example: El email no está en el formato correcto
 *                                              value:
 *                                                  type: string
 *                                                  example: usuariodeprueba@gmail.
 *                                              path:
 *                                                  type: string
 *                                                  example: email
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
 *                                                  example: El usuario que intenta actualizar no existe
 *                                              value:
 *                                                  type: string
 *                                                  example: usuariodeprueba@gmail.com
 *                                              path:
 *                                                  type: string
 *                                                  example: email
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
 *                                                  example: El nuevo email pertenece a otro usuario
 *                                              value:
 *                                                  type: string
 *                                                  example: usuariodeprueba@gmail.com
 *                                              path:
 *                                                  type: string
 *                                                  example: nuevo_email
 *                                              location:
 *                                                  type: string
 *                                                  example: body                               
 *                                              
 *         
 */
router.patch("/update",
    body("email")
        .notEmpty().withMessage("El email esta vacío")
        .isEmail().withMessage("El email no está en el formato correcto"),
    body("nuevo_email")
        .optional()
        .isEmail().withMessage("El nuevo email no está en el formato correcto"),
    body("nombre")
        .optional()
        .isString().withMessage("El tipo debe ser una cadena de caracteres"),
    body("apellido")
        .optional()
        .isString().withMessage("El tipo debe ser una cadena de caracteres"),
    body("contraseña")
        .optional()
        .notEmpty().withMessage("La contraseña no puede estar vacia"),
    body("nombre_tipo")
        .optional()
        .isString().withMessage("El tipo debe ser una cadena de caracteres"),
    handleInputErrors,
    handlePasswordEncrypt,
    normalizeFieldsGeneral(configUpdate),
    updatePartialUser);

/**
 * @swagger
 * /api/user/delete/{email}:
 *      delete:
 *          summary: Elimina al usuario
 *          tags:
 *              - Usuarios
 *          description: Esta ruta se encarga de eliminar a los usuarios
 *          parameters:
 *            - in: path
 *              name: email
 *              description: El correo del usuario
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
 *                                      example: "Usuario eliminado exitosamente"
 *                                  response:
 *                                      type: object
 *                                      properties:
 *                                          email:
 *                                              type: string
 *                                              example: usuariodeprueba@gmail.com
 *                                          nombre:
 *                                              type: string
 *                                              example: Juan
 *                                          apellido:
 *                                              type: string
 *                                              example: Perez
 *                                          contraseña:
 *                                              type: string
 *                                              example: $2b$10$w.wDW
 *                                          nombre_tipo:
 *                                              type: string
 *                                              example: usuario
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
 *                                                  example: El email no está en el formato correcto
 *                                              value:
 *                                                  type: string
 *                                                  example: usuariodeprueba@gmail.
 *                                              path:
 *                                                  type: string
 *                                                  example: email
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
 *                                                  example: Usuario no encontrado
 *                                              value:
 *                                                  type: string
 *                                                  example: usuariodeprueba@gmail.com
 *                                              path:
 *                                                  type: string
 *                                                  example: email
 *                                              location:
 *                                                  type: string
 *                                                  example: params                                        
 *                              
 *                                              
 *         
 */
const configDelete = {
    "email": "lowercase",
};
router.delete("/delete/:email",
    param("email")
        .notEmpty().withMessage("El email está vacio")
        .isEmail().withMessage("El email no está en el formato correcto"),
    handleInputErrors,
    normalizeFieldsGeneral(configDelete),
    deleteUser);

export default router;