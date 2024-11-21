import {Router} from "express"
import {body,param} from "express-validator"
import {handleInputErrors} from "../middleware/index"




const router = Router();


/**
* @swagger
* components:
*       schemas:
*           Cotizaciones:
*               type: object
*               properties:
*                   numero_folio:
*                       type: number
*                       description: Numero de la cotizacion
*                       example: 1
*                   pago_neto:
*                       type: number
*                       description: Numero decimal, representa el pago sin iva
*                       example: 50000
*                   iva:
*                       type: number
*                       description: Es el iva de la cotizacion si es que existe
*                       example: 0
*                   fecha:
*                       type: string
*                       description: Es la fecha de emision de la factura o cotizacion
*                       example: "2024-10-03"
*                   rut_emisor:
*                       type: string
*                       description: "Es el rut del emisor de la factura"
*                       example: "77.123.456-7"
*                   rut_receptor:
*                       type: string
*                       description: "Es el rut del receptor de la factura"
*                       example: "77.324.222-9"
*                   codigo_giro:
*                       type: number
*                       description: "Es el codigo del giro o actividad economica del SII"
*                       example: 11101
*                   imagen:
*                       type: number
*                       description: "Es la url en donde se guardan los archivos"
*                       example: "./carpeta/archivo.pdf"
*/



/**
 * @swagger
 * /api/invoices/create:
 *      post:
 *          summary: Crear una cotizacion
 *          tags:
 *              - Cotizaciones
 *          description: Esta ruta se encarga de crear a una cotizacion
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Cotizaciones'
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



export default router;