import {Router} from "express"
import {body,param} from "express-validator"
import {handleInputErrors} from "../middleware/index"
import { createInvoice } from "../handlers/invoices";




const router = Router();


/**
* @swagger
* components:
*       schemas:
*           Facturas:
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
*                   estado:
*                       type: string
*                       description: "Estado de eliminado o activo"
*                       example: "activo"
*                   servicios:
*                       type: array
*                       items:
*                           type: object
*                           properties:
*                               nombre:
*                                   type: string
*                                   example: "Construcciones"
*/



/**
 * @swagger
 * /api/invoices/create:
 *      post:
 *          summary: Crear una factura
 *          tags:
 *              - Facturas
 *          description: Esta ruta se encarga de crear a una factura
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Facturas'
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
 *                                      example: Factura creada correctamente
 *                                  response:
 *                                      $ref: '#/components/schemas/Facturas'
 *                                          
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
 *                                                  example: El rut no esta en formato
 *                                              value:
 *                                                  type: string
 *                                                  example: +..asda
 *                                              path:
 *                                                  type: string
 *                                                  example: rut_emisor
 *                                              location:
 *                                                  type: string
 *                                                  example: body
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
 *                                                  example: La factura que intenta actualizar no existe
 *                                              value:
 *                                                  type: string
 *                                                  example: 2
 *                                              path:
 *                                                  type: string
 *                                                  example: numero_folio
 *                                              location:
 *                                                  type: string
 *                                                  example: body                                           
 *                              
 *                                              
 *         
 */
router.post("/create", createInvoice);



export default router;