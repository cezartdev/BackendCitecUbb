import {Router} from "express"
import {body,param} from "express-validator"
import {handleInputErrors} from "../middleware/index"
import {getAll, getById} from "../handlers/province"

const router = Router();

/**
* @swagger
* components:
*       schemas:
*           Provincia:
*               type: object
*               properties:
*                   id:
*                       type: number
*                       description: Codigo territorial de la provincia
*                       example: 11
*                   nombre:
*                       type: string
*                       description: El nombre de la provincia
*                       example: Concepción
*                   region:
*                       type: number
*                       description: El nombre de la región donde se encuentra la provincia
*                       example: Biobío
*/

/**
 * @swagger
 * /api/province/get-all:
 *      get:
 *          summary: Obtiene a todas las provincias en un arreglo de objetos
 *          tags:
 *              - Provincias
 *          description: Esta ruta se encarga de devolver a las provincias con todos sus propiedades en un arreglo de objetos

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
 *                                      example: "Provincias seleccionadas correctamente"
 *                                  response:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                               id:
 *                                                  type: number
 *                                                  example: 11
 *                                               nombre:
 *                                                  type: string
 *                                                  example: Iquique
 *                                               region:
 *                                                  type: number
 *                                                  example: 1
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
 * /api/province/get-by-id/{id}:
 *      get:
 *          summary: Obtiene a una provincia segun su id
 *          tags:
 *              - Provincias
 *          description: Esta ruta se encarga de devolver a una provincia con todos sus propiedades en un objeto
 *          parameters:
 *            - in: path
 *              name: id
 *              description: El codigo territorial de la provincia
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
 *                                      example: "Provincia seleccionada correctamente"
 *                                  response:
 *                                          type: object
 *                                          properties:
 *                                               id:
 *                                                  type: number
 *                                                  example: 11
 *                                               nombre:
 *                                                  type: string
 *                                                  example: Iquique
 *                                               region:
 *                                                  type: number
 *                                                  example: 1
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
 *                                                  example: Provincia no encontrada
 *                                              value:
 *                                                  type: string
 *                                                  example: aa
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