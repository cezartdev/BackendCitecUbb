import { Router } from "express"
import { body, param } from "express-validator"
import { handleInputErrors } from "../middleware/index"
import { getAll, getById } from "../handlers/businessLine"


const router = Router();

/**
* @swagger
* components:
*       schemas:
*           Giro:
*               type: object
*               properties:
*                   codigo:
*                       type: integer
*                       description: Código único del giro
*                       example: 101
*                   nombre:
*                       type: string
*                       description: Nombre del giro
*                       example: Comercio al por menor
*                   nombre_categorias:
*                       type: string
*                       description: Categoría a la que pertenece el giro
*                       example: Construcción
*/

/**
 * @swagger
 * /api/giro/get-all:
 *      get:
 *          summary: Obtiene todos los giros en un arreglo de objetos
 *          tags:
 *              - Giros
 *          description: Esta ruta se encarga de devolver todos los giros con sus propiedades en un arreglo de objetos
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
 *                                      example: "Giros seleccionados correctamente"
 *                                  response:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                               codigo:
 *                                                  type: integer
 *                                                  example: 101
 *                                               nombre:
 *                                                  type: string
 *                                                  example: Comercio al por menor
 *                                               nombre_categorias:
 *                                                  type: string
 *                                                  example: Construcción
 *                                               created_at:
 *                                                  type: string
 *                                                  example: 2024-09-29T22:35:16.000Z
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
 */

router.get("/get-all", getAll);

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

router.get("/get-by-id/:codigo",
    param("codigo")
        .notEmpty().withMessage("El codigo no puede estar vacio")
        .isNumeric().withMessage("Tipo de dato incorrecto para el codigo"),
    getById);

export default router;