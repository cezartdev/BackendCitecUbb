import { Router } from "express"
import { body } from "express-validator"
import { handleInputErrors } from "../middleware/index"
import { getAll } from "../handlers/category"

const router = Router();

/**
 * @swagger
 * components:
 *       schemas:
 *           Categoria:
 *               type: object
 *               properties:
 *                   nombre:
 *                       type: string
 *                       description: Nombre único de la categoría
 *                       example: Construcción
 */

/**
 * @swagger
 * /api/categoria/get-all:
 *      get:
 *          summary: Obtiene todas las categorías en un arreglo de objetos
 *          tags:
 *              - Categorías
 *          description: Esta ruta se encarga de devolver todas las categorías con sus propiedades en un arreglo de objetos
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
 *                                      example: "Categorías seleccionadas correctamente"
 *                                  response:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                               nombre:
 *                                                  type: string
 *                                                  example: Construcción
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
 *                                                  example: No se sabe cómo manejar la solicitud
 */

router.get("/get-all", getAll);



export default router;