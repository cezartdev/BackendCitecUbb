import {Router} from "express"
import {body,param} from "express-validator"
import {handleInputErrors} from "../middleware/index"
import {getAll, getById} from "../handlers/region"

const router = Router();
/**
* @swagger
* components:
*       schemas:
*           Region:
*               type: object
*               properties:
*                   id:
*                       type: number
*                       description: Id de la region
*                       example: 1
*                   nombre:
*                       type: string
*                       description: El nombre de la región
*                       example: Tarapacá
*                   ordinal:
*                       type: string
*                       description: El numero romano de la region
*                       example: I
*/

/**
 * @swagger
 * /api/region/get-all:
 *      get:
 *          summary: Obtiene a todas las regiones en un arreglo de objetos
 *          tags:
 *              - Regiones
 *          description: Esta ruta se encarga de devolver a las regiones con todas sus propiedades en un arreglo de objetos

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
 *                                      example: "Regiones seleccionadas correctamente"
 *                                  response:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                               id:
 *                                                  type: string
 *                                                  example: 2
 *                                               nombre:
 *                                                  type: string
 *                                                  example: Antofagasta
 *                                               ordinal:
 *                                                  type: string
 *                                                  example: II
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
 * /api/region/get-by-id/{id}:
 *      get:
 *          summary: Obtiene a una region segun su id
 *          tags:
 *              - Regiones
 *          description: Esta ruta se encarga de devolver a una region con todas sus propiedades en un objeto
 *          parameters:
 *            - in: path
 *              name: id
 *              description: El id de una region
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
 *                                      example: "Region seleccionada correctamente"
 *                                  response:
 *                                          type: object
 *                                          properties:
 *                                               id:
 *                                                  type: string
 *                                                  example: 8
 *                                               nombre:
 *                                                  type: string
 *                                                  example: Biobío
 *                                               ordinal:
 *                                                  type: string
 *                                                  example: VIII
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
 *                                                  example: Region no encontrada
 *                                              value:
 *                                                  type: string
 *                                                  example: fghhdfs
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