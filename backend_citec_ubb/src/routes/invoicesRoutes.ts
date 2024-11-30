import {Router} from "express"
import {body,param} from "express-validator"
import {handleInputErrors} from "../middleware/index"
import { createInvoice, deleteInvoice, getAll, getAllDeleted, getById, updateAllInvoice } from "../handlers/invoices";




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
*                   fecha_emision:
*                       type: string
*                       description: Es la fecha de emision de la factura o cotizacion
*                       example: "2024-10-03"
*                   emisor:
*                       type: string
*                       description: "Es el emisor de la factura"
*                       example: "por decidir"
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
*                       example: "activo o eliminado"
*                   usuario:
*                       type: string
*                       description: "Es el correo usuario que genero la factura"
*                       example: "admin@gmail.com"
*                   precio_por_servicio:
*                       type: array
*                       items:
*                           type: object
*                           properties:
*                               precio_neto:
*                                   type: number
*                                   example: 10000
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
 *                                                  type: number
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

/**
 * @swagger
 * /api/invoices/delete/{numero_folio}:
 *      delete:
 *          summary: Elimina una factura
 *          tags:
 *              - Facturas
 *          description: Esta ruta se encarga de eliminar a una factura
 *          parameters:
 *            - in: path
 *              name: numero_folio
 *              description: El numero de folio de una factura
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
 *                                      example: "Factura eliminada correctamente"
 *                                  response:
 *                                      $ref: '#/components/schemas/Facturas'
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
 *                                                  example: Formato del numero de folio Incorrecto.
 *                                              value:
 *                                                  type: string
 *                                                  example: dgf2
 *                                              path:
 *                                                  type: string
 *                                                  example: numero_folio
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
 *                                                  example: La factura que intenta eliminar no existe
 *                                              value:
 *                                                  type: number
 *                                                  example: 5
 *                                              path:
 *                                                  type: string
 *                                                  example: numero_folio
 *                                              location:
 *                                                  type: string
 *                                                  example: params                                               
 */

router.delete("/delete/:numero_folio", deleteInvoice);


/**
 * @swagger
 * /api/invoices/get-by-id/{numero_folio}:
 *      get:
 *          summary: Obtiene a una factura segun su numero de folio
 *          tags:
 *              - Facturas
 *          description: Esta ruta se encarga de devolver a una factura con todas sus propiedades en un objeto
 *          parameters:
 *            - in: path
 *              name: numero_folio
 *              description: El numero de folio de la factura
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
 *                                      example: "Factura obtenida correctamente"
 *                                  response:
 *                                      $ref: '#/components/schemas/Facturas'
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
 *                                                  example: Formato del folio Incorrecto
 *                                              value:
 *                                                  type: string
 *                                                  example: asd1l
 *                                              path:
 *                                                  type: string
 *                                                  example: numero_folio
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
 *                                                  example: Factura no encontrada
 *                                              value:
 *                                                  type: string
 *                                                  example: 7
 *                                              path:
 *                                                  type: string
 *                                                  example: numero_folio
 *                                              location:
 *                                                  type: string
 *                                                  example: params                                                                              
 *                                 
 */
router.get("/get-by-id/:numero_folio", getById);

/**
 * @swagger
 * /api/invoices/get-all:
 *      get:
 *          summary: Obtiene a todas las facturas en un arreglo de objetos
 *          tags:
 *              - Facturas
 *          description: Esta ruta se encarga de devolver las facturas con todas sus propiedades en un arreglo de objetos

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
 *                                      example: "Facturas seleccionadas correctamente"
 *                                  response:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#/components/schemas/Facturas'                                           
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
 *                                                  example: No existen facturas
 *                                              value:
 *                                                  type: string
 *                                                  example: ""
 *                                              path:
 *                                                  type: string
 *                                                  example: ""
 *                                              location:
 *                                                  type: string
 *                                                  example: ""                                                   
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
router.get("/get-all",  getAll);


/**
 * @swagger
 * /api/invoices/get-all-deleted:
 *      get:
 *          summary: Obtiene a todas las facturas en un arreglo de objetos
 *          tags:
 *              - Facturas
 *          description: Esta ruta se encarga de devolver las facturas eliminadas con todas sus propiedades en un arreglo de objetos
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
 *                                      example: "Facturas eliminadas seleccionadas correctamente"
 *                                  response:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#/components/schemas/Facturas'                                           
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
 *                                                  example: No existen facturas eliminadas
 *                                              value:
 *                                                  type: string
 *                                                  example: ""
 *                                              path:
 *                                                  type: string
 *                                                  example: ""
 *                                              location:
 *                                                  type: string
 *                                                  example: ""                                                   
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
router.get("/get-all-deleted",  getAllDeleted);


/**
 * @swagger
 * /api/invoices/update:
 *      put:
 *          summary: Actualiza una factura Totalmente
 *          tags:
 *              - Facturas
 *          description: Esta ruta se encarga de editar o actualizar una factura de forma total o completa, es decir, se deben pasar obligatoriamente todos los atributos de la entidad
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Facturas'                         
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
 *                                      example: Servicio Actualizado correctamente
 *                                  response:
 *                                      type: object
 *                                      properties:
 *                                          nombre:
 *                                              type: string
 *                                              example: "Revision 2 de muros"
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
 *                                                  example: El nombre no está en el formato correcto
 *                                              value:
 *                                                  type: string
 *                                                  example: "2291234572\a+@d"
 *                                              path:
 *                                                  type: string
 *                                                  example: nombre
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
 *                                                  example: El servicio que intenta actualizar no existe
 *                                              value:
 *                                                  type: string
 *                                                  example: "Lavado de autos"
 *                                              path:
 *                                                  type: string
 *                                                  example: nombre
 *                                              location:
 *                                                  type: string
 *                                                  example: body                                        
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
 *                                                  example: El nuevo nombre pertenece a otro servicio
 *                                              value:
 *                                                  type: string
 *                                                  example: "Revision 2 de muros"
 *                                              path:
 *                                                  type: string
 *                                                  example: nuevo_nombre
 *                                              location:
 *                                                  type: string
 *                                                  example: body                               
 *                                              
 *         
 */
router.put("/update", updateAllInvoice);

export default router;