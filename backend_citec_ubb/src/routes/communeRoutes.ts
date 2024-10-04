import {Router} from "express"
import {body, param} from "express-validator"
import {handleInputErrors} from "../middleware/index"
import {getAll, getById} from "../handlers/commune"

const router = Router();

/**
* @swagger
* components:
*       schemas:
*           Comuna:
*               type: object
*               properties:
*                   id:
*                       type: number
*                       description: Codigo territorial de la comuna
*                       example: 8103
*                   nombre:
*                       type: string
*                       description: El nombre de la comuna
*                       example: Chiguayante
*                   provincia:
*                       type: number
*                       description: El nombre de la provincia donde se encuentra la comuna
*                       example: Concepción
*/


/**
 * @swagger
 * /api/commune/get-all:
 *      get:
 *          summary: Obtiene a todas las comunas en un arreglo de objetos
 *          tags:
 *              - Comunas
 *          description: Esta ruta se encarga de devolver a las comunas con todos sus propiedades en un arreglo de objetos

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
 *                                      example: "Comunas seleccionadas correctamente"
 *                                  response:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                               id:
 *                                                  type: number
 *                                                  example: 1101
 *                                               nombre:
 *                                                  type: string
 *                                                  example: Iquique
 *                                               provincia:
 *                                                  type: number
 *                                                  example: 11
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
router.get("/get-all",getAll);


/**
 * @swagger
 * /api/commune/get-by-id/{id}:
 *      get:
 *          summary: Obtiene a una comuna segun su id
 *          tags:
 *              - Comunas
 *          description: Esta ruta se encarga de devolver a una comuna con todos sus propiedades en un objeto
 *          parameters:
 *            - in: path
 *              name: id
 *              description: El codigo territorial de la comuna
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
 *                                      example: "Comuna seleccionada correctamente"
 *                                  response:
 *                                          type: object
 *                                          properties:
 *                                               id:
 *                                                  type: number
 *                                                  example: 8103
 *                                               nombre:
 *                                                  type: string
 *                                                  example: Chiguayante
 *                                               provincia:
 *                                                  type: number
 *                                                  example: 81
 *                                               created_at:
 *                                                  type: string
 *                                                  example: 2024-09-29T22:35:16.000Z                                           
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
 *                                                  example: Comuna no encontrada
 *                                              value:
 *                                                  type: string
 *                                                  example: lpn
 *                                              path:
 *                                                  type: string
 *                                                  example: id
 *                                              location:
 *                                                  type: string
 *                                                  example: params                                                                              
 *                                 
 */
router.get("/get-by-id/:id",
    param("id")
        .notEmpty().withMessage("El id no puede estar vacio")
        .isNumeric().withMessage("Tipo de dato incorrecto para el id"),
    getById);


export default router;