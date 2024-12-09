import {Router} from "express"
import {body,param} from "express-validator"
import {handleInputErrors, capitalizeWords, toLowerCaseString, toUpperCaseString} from "../middleware/index"
import {getAll, createWorkOrder, getById, updateAllWorkOrder, deleteWorkOrder, getAllDeleted, } from "../handlers/workOrder"

const rutRegex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/;

const router = Router();

/**
* @swagger
* components:
*       schemas:
*           Ordenes_de_trabajo:
*               type: object
*               properties:
*               numero_folio:
*                   type: number
*                   description: Numero de la orden de trabajo
*                   example: 1
*               fecha_solicitud:
*                   type: string
*                   format: date
*                   description: Fecha de solicitud de la orden de trabajo
*                   example: "2024-10-01"
*               fecha_entrega:
*                   type: string
*                   format: date
*                   description: Fecha de entrega de la orden de trabajo
*                   example: "2024-10-10"
*               observacion:
*                   type: string
*                   description: Observaciones de la orden de trabajo
*                   example: "Requiere revisión adicional"
*               cliente:
*                   type: string
*                   description: Cliente asociado a la orden de trabajo
*                   example: "77.123.456-9"
*               direccion:
*                   type: string
*                   description: Dirección del cliente
*                   example: "Av. Siempre Viva 123"
*               provincia:
*                   type: number
*                   description: ID de la provincia
*                   example: 1
*               imagen:
*                   type: string
*                   description: URL de la imagen asociada
*                   example: "./carpeta/archivo.pdf"
*               estado:
*                   type: string
*                   description: Estado de la orden de trabajo
*                   example: "activo"
*               comuna:
*                   type: number
*                   description: ID de la comuna
*                   example: 1
*               descripcion:
*                   type: string
*                   description: Descripción de la orden de trabajo
*                   example: "Instalación de equipo"
*               servicios:
*                   type: array
*                   items:
*                       type: object
*                       properties:
*                           nombre:
*                               type: string
*                               example: "Construcciones"
*/

/**
 * @swagger
 * /api/workOrder/create:
 *      post:
 *          summary: Crear una orden de trabajo
 *          tags:
 *              - Ordenes de Trabajo
 *          description: Esta ruta se encarga de crear una orden de trabajo
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              numero_folio:
 *                                  type: number
 *                                  example: 1
 *                              observacion:
 *                                  type: string
 *                                  example: "Requiere revisión adicional"
 *                              cliente:
 *                                  type: string
 *                                  example: "77.123.456-9"
 *                              direccion:
 *                                  type: string
 *                                  example: "Av. Siempre Viva 123"
 *                              provincia:
 *                                  type: number
 *                                  example: 1
 *                              comuna:
 *                                  type: number
 *                                  example: 1
 *                              descripcion:
 *                                  type: string
 *                                  example: "Instalación de equipo"
 *                              servicios:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          nombre:
 *                                              type: string
 *                                              example: "Servicio de instalación"
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
 *                                      example: Orden de trabajo creada correctamente
 *                                  response:
 *                                      $ref: '#/components/schemas/Ordenes_de_trabajo'
 *              400:
 *                  description: Petición mal hecha (Bad Request)
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
 *                                                  example: El campo observacion está vacío
 *                                              value:
 *                                                  type: string
 *                                                  example: ""
 *                                              path:
 *                                                  type: string
 *                                                  example: observacion
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
 *                                                  example: La orden de trabajo que intenta actualizar no existe
 *                                              value:
 *                                                  type: number
 *                                                  example: 2
 *                                              path:
 *                                                  type: string
 *                                                  example: numero_folio
 *                                              location:
 *                                                  type: string
 *                                                  example: body                                           
 */

router.post("/create",
      body("numero_folio")
        .notEmpty().withMessage("El numero_folio está vacío")
        .isInt().withMessage("Tipo de dato incorrecto para el numero_folio"),
      body("observacion")
        .notEmpty().withMessage("La observacion está vacía")
        .isString().withMessage("Tipo de dato incorrecto para la observacion")
        .isLength({ max: 300 }).withMessage("La observacion debe tener máximo 300 caracteres"),
      body("cliente")
        .notEmpty().withMessage("El cliente está vacío")
        .isString().withMessage("Tipo de dato incorrecto para el cliente")
        .matches(rutRegex).withMessage("Formato de rut invalido. Debe ser '11.111.111-1'"),
      body("direccion")
        .notEmpty().withMessage("La direccion está vacía")
        .isString().withMessage("Tipo de dato incorrecto para la direccion")
        .isLength({ max: 250 }).withMessage("La direccion debe tener máximo 250 caracteres"),
      body("provincia")
        .notEmpty().withMessage("La provincia está vacía")
        .isInt().withMessage("Tipo de dato incorrecto para la provincia"),
      body("comuna")
        .notEmpty().withMessage("La comuna está vacía")
        .isInt().withMessage("Tipo de dato incorrecto para la comuna"),
      body("descripcion")
        .notEmpty().withMessage("La descripcion está vacía")
        .isString().withMessage("Tipo de dato incorrecto para la descripcion")
        .isLength({ max: 100 }).withMessage("La descripcion debe tener máximo 100 caracteres"),
      body("servicios").isArray({ min: 1 }).withMessage("Debe incluir al menos un servicio"),
      body("servicios.*.nombre")
        .notEmpty().withMessage("El nombre del servicio está vacío")
        .isString().withMessage("Tipo de dato incorrecto para el nombre del servicio")
        .customSanitizer(value => typeof value === "string" ? capitalizeWords(value) : value),
        handleInputErrors,
        createWorkOrder);    

/**
 * @swagger
 * /api/workOrder/delete/{numero_folio}:
 *      delete:
 *          summary: Elimina una orden de trabajo
 *          tags:
 *              - Ordenes de Trabajo
 *          description: Esta ruta se encarga de eliminar una orden de trabajo
 *          parameters:
 *            - in: path
 *              name: numero_folio
 *              description: El numero de folio de una orden de trabajo
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
 *                                      example: "Orden de trabajo eliminada correctamente"
 *                                  response:
 *                                      $ref: '#/components/schemas/Ordenes_de_trabajo' 
 *              400:
 *                  description: Petición mal hecha (Bad Request)
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
 *                                                  example: Formato del numero de folio incorrecto.
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
 *                                                  example: La orden de trabajo que intenta eliminar no existe
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

router.delete(
    "/delete/:numero_folio",
    [
        param("numero_folio")
        .notEmpty().withMessage("El numero del folio está vacío")
        .isNumeric().withMessage("Tipo de dato incorrecto para el numero de folio"),
        handleInputErrors,
    ],
    deleteWorkOrder
    );

/**
 * @swagger
 * /api/workOrder/update:
 *      put:
 *          summary: Actualiza una orden de trabajo completamente
 *          tags:
 *              - Ordenes de Trabajo
 *          description: Esta ruta se encarga de editar o actualizar una orden de trabajo de forma total o completa, es decir, se deben pasar obligatoriamente todos los atributos de la entidad
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              numero_folio:
 *                                  type: number
 *                                  example: 1
 *                              observacion:
 *                                  type: string
 *                                  example: "Requiere revisión adicional"
 *                              cliente:
 *                                  type: string
 *                                  example: "77.123.456-9"
 *                              direccion:
 *                                  type: string
 *                                  example: "Av. Siempre Viva 123"
 *                              provincia:
 *                                  type: number
 *                                  example: 1
 *                              comuna:
 *                                  type: number
 *                                  example: 1
 *                              estado:
 *                                  type: string
 *                                  example: "activo"
 *                              descripcion:
 *                                  type: string
 *                                  example: "Instalación de equipo"
 *                              servicios:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          nombre:
 *                                              type: string
 *                                              example: "Servicio de instalación"
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
 *                                      example: Orden de trabajo actualizada correctamente
 *                                  response:
 *                                      $ref: '#/components/schemas/WorkOrder'  
 *              400:
 *                  description: Petición mal hecha (Bad Request)
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
 *                                                  example: Tipo de dato incorrecto para el numero de folio
 *                                              value:
 *                                                  type: string
 *                                                  example: "2291234572\a+@d"
 *                                              path:
 *                                                  type: string
 *                                                  example: numero_folio
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
 *                                                  example: La orden de trabajo que intenta actualizar no existe
 *                                              value:
 *                                                  type: string
 *                                                  example: "Lavado de autos"
 *                                              path:
 *                                                  type: string
 *                                                  example: numero_folio
 *                                              location:
 *                                                  type: string
 *                                                  example: body                             
 */

    router.put("/update",
          body("numero_folio")
            .notEmpty().withMessage("El numero de folio está vacío")
            .isNumeric().withMessage("Tipo de dato incorrecto para el numero de folio"),
          body("observacion")
            .notEmpty().withMessage("La observacion está vacía")
            .isString().withMessage("Tipo de dato incorrecto para la observacion")
            .isLength({ max: 300 }).withMessage("La observacion debe tener máximo 300 caracteres"),
          body("cliente")
            .notEmpty().withMessage("El cliente está vacío")
            .isString().withMessage("Tipo de dato incorrecto para el cliente")
            .matches(rutRegex).withMessage("Formato de rut invalido. Debe ser '11.111.111-1'"),
          body("direccion")
            .notEmpty().withMessage("La direccion está vacía")
            .isString().withMessage("Tipo de dato incorrecto para la direccion")
            .isLength({ max: 250 }).withMessage("La direccion debe tener máximo 250 caracteres"),
          body("provincia")
            .notEmpty().withMessage("La provincia está vacía")
            .isNumeric().withMessage("Tipo de dato incorrecto para la provincia"),
          body("comuna")
            .notEmpty().withMessage("La comuna está vacía")
            .isNumeric().withMessage("Tipo de dato incorrecto para la comuna"),
          body("estado")
            .notEmpty().withMessage("El estado está vacío")
            .isString().withMessage("Tipo de dato incorrecto para el estado"),
          body("descripcion")
            .notEmpty().withMessage("La descripcion está vacía")
            .isString().withMessage("Tipo de dato incorrecto para la descripcion")
            .isLength({ max: 100 }).withMessage("La descripcion debe tener máximo 100 caracteres"),
          body("servicios").isArray({ min: 1 }).withMessage("Debe incluir al menos un servicio"),
          body("servicios.*.nombre")
            .notEmpty().withMessage("El nombre del servicio está vacío")
            .isString().withMessage("Tipo de dato incorrecto para el nombre del servicio")
            .customSanitizer(value => typeof value === "string" ? capitalizeWords(value) : value),
          handleInputErrors,
        updateAllWorkOrder);

/**
 * @swagger
 * /api/workOrder/get-by-id/{numero_folio}:
 *      get:
 *          summary: Obtiene una orden de trabajo según su número de folio
 *          tags:
 *              - Ordenes de Trabajo
 *          description: Esta ruta se encarga de devolver una orden de trabajo con todas sus propiedades en un objeto
 *          parameters:
 *            - in: path
 *              name: numero_folio
 *              description: El número de folio de la orden de trabajo
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
 *                                      example: "Orden de trabajo obtenida correctamente"
 *                                  response:
 *                                      $ref: '#/components/schemas/Ordenes_de_trabajo'
 *              400:
 *                  description: Petición mal hecha (Bad Request)
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
 *                                                  example: Formato del folio incorrecto
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
 *                                                  example: Orden de trabajo no encontrada
 *                                              value:
 *                                                  type: string
 *                                                  example: 7
 *                                              path:
 *                                                  type: string
 *                                                  example: numero_folio
 *                                              location:
 *                                                  type: string
 *                                                  example: params
 */

router.get("/get-by-id/:numero_folio",
    param("numero_folio")
        .notEmpty().withMessage("El numero del folio esta vacio")
        .isNumeric().withMessage("Tipo de dato incorrecto para el numero del folio"),
    handleInputErrors,
    getById);

/**
 * @swagger
 * /api/workOrder/get-all:
 *      get:
 *          summary: Obtiene todas las órdenes de trabajo en un arreglo de objetos
 *          tags:
 *              - Ordenes de Trabajo
 *          description: Esta ruta se encarga de devolver las órdenes de trabajo con todas sus propiedades en un arreglo de objetos
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
 *                                      example: "Órdenes de trabajo seleccionadas correctamente"
 *                                  response:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#/components/schemas/Ordenes_de_trabajo'                                           
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
 *                                                  example: No existen órdenes de trabajo
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
 *                                                  example: No se sabe cómo manejar la solicitud                              
 */

router.get("/get-all",  getAll);

/**
 * @swagger
 * /api/workOrder/get-all-deleted:
 *      get:
 *          summary: Obtiene todas las órdenes de trabajo eliminadas en un arreglo de objetos
 *          tags:
 *              - Ordenes de Trabajo
 *          description: Esta ruta se encarga de devolver las órdenes de trabajo eliminadas con todas sus propiedades en un arreglo de objetos
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
 *                                      example: "Órdenes de trabajo eliminadas seleccionadas correctamente"
 *                                  response:
 *                                      type: array
 *                                      items:
 *                                          $ref: '#/components/schemas/Ordenes_de_trabajo'                                           
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
 *                                                  example: No existen órdenes de trabajo eliminadas
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
 *                                                  example: No se sabe cómo manejar la solicitud                              
 */

router.get("/get-all-deleted",  getAllDeleted);


export default router;