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
 * /api/bussiness-line/get-all:
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
 * /api/bussiness-line/get-by-id/{id}:
 *      get:
 *          summary: Obtiene a un giro segun su codigo
 *          tags:
 *              - Giros
 *          description: Esta ruta se encarga de devolver a un giro con todas sus propiedades en un objeto
 *          parameters:
 *            - in: path
 *              name: id
 *              description: El codigo del giro
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
 *                                      example: "Giro seleccionada correctamente"
 *                                  response:
 *                                          type: object
 *                                          properties:
 *                                               codigo:
 *                                                  type: number
 *                                                  example: 11101
 *                                               nombre:
 *                                                  type: string
 *                                                  example: CULTIVO DE TRIGO
 *                                               afecto_iva:
 *                                                  type: string
 *                                                  example: SI
 *                                               categoria:
 *                                                  type: string
 *                                                  example: AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA
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