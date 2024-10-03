import {Router} from "express"
import {body} from "express-validator"
import {createUser,loginUser,getAll, deleteUser} from "../handlers/user"
import {handleInputErrors, handlePasswordEncrypt} from "../middleware/index"

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
 *                                                  example: El email esta vacio
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
router.post("/create",handlePasswordEncrypt,createUser) ;
router.post("/login",
    body("email")
        .notEmpty().withMessage("El email no puede estar vacío")
        .isEmail().withMessage("El email no está en el formato correcto"),
    body("contraseña")
        .notEmpty().withMessage("La contraseña esta vacía"),
    handleInputErrors,
    loginUser);

router.get("/get-all", getAll);
router.delete("/delete/:id", deleteUser);

export default router;