import {Router} from "express"
import {body} from "express-validator"
import {handleInputErrors} from "../middleware/index"
import {getAll} from "../handlers/type"

const router = Router();


/**
* @swagger
* components:
*       schemas:
*           Tipos:
*               type: object
*               properties:
*                   nombre:
*                       type: string
*                       description: El nombre del tipo de usuario
*                       example: admin
*/


/**
 * @swagger
 * /api/type/get-all:
 *      get:
 *          summary: Obtiene a todos los tipos de usuario en un arreglo de objetos
 *          tags:
 *              - Tipos
 *          description: Esta ruta se encarga de devolver a los tipos de usuario con todas sus propiedades en un arreglo de objetos
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
 *                                      example: "Tipos de usuarios seleccionados correctamente"
 *                                  response:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                               nombre:
 *                                                  type: string
 *                                                  example: admin
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



export default router;