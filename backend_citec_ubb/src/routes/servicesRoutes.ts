import {Router} from "express"
import {body,param} from "express-validator"
import {handleInputErrors} from "../middleware/index"




const router = Router();



/**
* @swagger
* components:
*       schemas:
*           Servicios:
*               type: object
*               properties:
*                   nombre:
*                       type: string
*                       description: Nombre del servicio
*                       example: "Revision de calidad de ventanas"
*/



/**
 * @swagger
 * /api/services/create:
 *      post:
 *          summary: Crear un servicio
 *          tags:
 *              - Servicios
 *          description: Esta ruta se encarga de crear a un servicio
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              nombre:
 *                                  type: string
 *                                  example: "Revision de calidad de muros" 
 *                              
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
 *                                      example: Servicio creado correctamente
 *                                  response:
 *                                      type: object
 *                                      properties:
 *                                          nombre:
 *                                              type: string
 *                                              example: "Revision de calidad de muros"  
 *                                          created_at:
 *                                              type: string
 *                                              example: 2024-10-03T19:36:42.000Z
 *                                          updated_at:
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
 *                                                  example: El nombre no esta en formato
 *                                              value:
 *                                                  type: string
 *                                                  example: +..asda
 *                                              path:
 *                                                  type: string
 *                                                  example: nombre
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
 *                                                  example: El servicio que intenta crear ya existe
 *                                              value:
 *                                                  type: string
 *                                                  example: "Revision de calidad de muros"
 *                                              path:
 *                                                  type: string
 *                                                  example: nombre
 *                                              location:
 *                                                  type: string
 *                                                  example: body
 *                                              
 *         
 */
router.post("/create", );


/**
 * @swagger
 * /api/services/delete/{nombre}:
 *      delete:
 *          summary: Elimina a un servicio
 *          tags:
 *              - Servicios
 *          description: Esta ruta se encarga de eliminar a un servicio
 *          parameters:
 *            - in: path
 *              name: nombre
 *              description: El nombre del servicio
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
 *                                      example: "Servicio eliminado correctamente"
 *                                  response:
 *                                      type: object
 *                                      properties:
 *                                          nombre:
 *                                              type: string
 *                                              example: "Revision de calidad de muros"                                                
 *                                          created_at:
 *                                              type: string
 *                                              example: 2024-10-03T19:36:42.000Z
 *                                          updated_at:
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
 *                                                  example: Formato de nombre invalido
 *                                              value:
 *                                                  type: string
 *                                                  example: "@¿¿d"
 *                                              path:
 *                                                  type: string
 *                                                  example: nombre
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
 *                                                  example: El servicio que intenta eliminar no existe
 *                                              value:
 *                                                  type: string
 *                                                  example: "Limpieza de autos"
 *                                              path:
 *                                                  type: string
 *                                                  example: nombre
 *                                              location:
 *                                                  type: string
 *                                                  example: params                                               
 */
router.delete("/delete/:nombre",);

router.put("/update", );

export default router;