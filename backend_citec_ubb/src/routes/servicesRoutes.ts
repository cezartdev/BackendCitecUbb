import {Router} from "express"
import {body,param} from "express-validator"
import {handleInputErrors, capitalizeWords} from "../middleware/index"
import {createService, getById, getAll, deleteService, getAllDeleted, updateAllService} from "../handlers/services"



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
*                   created_at:
*                       type: string 
*                       description: "Fecha de creacion" 
*                       example: "2024-11-24T23:33:02.000Z"
*                   updated_at:
*                       type: string 
*                       description: "Fecha de actualizacion" 
*                       example: "2024-11-24T23:33:02.000Z"
*                   estado:
*                       type: string
*                       description: "Estado de el servicio"
*                       example: "activo"  
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
router.post("/create",
    body("nombre")
        .notEmpty().withMessage("El nombre esta vacio")
        .isString().withMessage("Tipo de dato incorrecto para el nombre")
        .customSanitizer(value => typeof value === "string" ? capitalizeWords(value) : value),
    handleInputErrors,
    createService);


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
router.delete("/delete/:nombre",
    param("nombre")
        .notEmpty().withMessage("El nombre esta vacio")
        .isString().withMessage("Tipo de dato incorrecto para el nombre")
        .customSanitizer(value => typeof value === "string" ? capitalizeWords(value) : value),
    handleInputErrors,
    deleteService);



/**
 * @swagger
 * /api/services/update:
 *      put:
 *          summary: Actualiza a un servicio Totalmente
 *          tags:
 *              - Servicios
 *          description: Esta ruta se encarga de editar o actualizar a los servicios de forma total o completa, es decir, se deben pasar obligatoriamente todos los atributos de la entidad
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              nombre:
 *                                  type: string
 *                                  example: "Revision de calidad"
 *                              nuevo_nombre:
 *                                  type: string
 *                                  example: "Revision 2 de muros"                                  
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
router.put("/update",
    body("nombre")
        .notEmpty().withMessage("El nombre esta vacio")
        .isString().withMessage("Tipo de dato incorrecto para el nombre")
        .customSanitizer(value => typeof value === "string" ? capitalizeWords(value) : value),
    body("nuevo_nombre")
        .notEmpty().withMessage("El nuevo nombre esta vacio")
        .isString().withMessage("Tipo de dato incorrecto para el nuevo nombre")
        .customSanitizer(value => typeof value === "string" ? capitalizeWords(value) : value),
    handleInputErrors,
    updateAllService );


/**
 * @swagger
 * /api/services/get-all:
 *      get:
 *          summary: Obtiene a todos los servicios en un arreglo de objetos
 *          tags:
 *              - Servicios
 *          description: Esta ruta se encarga de devolver a los servicios con todas sus propiedades en un arreglo de objetos

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
 *                                      example: "Servicios seleccionados correctamente"
 *                                  response:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                               nombre:
 *                                                  type: string
 *                                                  example: "Construccion de muros"
 *                                               created_at:
 *                                                  type: string
 *                                                  example: 2024-09-29T22:35:16.000Z
 *                                               updated_at:
 *                                                  type: string
 *                                                  example: 2024-09-29T22:35:16.000Z                                             
 *                                               estado:
 *                                                  type: string
 *                                                  example: "activo"                                             
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
 *                                                  example: No existen servicios
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
router.get("/get-all", getAll );

/**
 * @swagger
 * /api/services/get-all-deleted:
 *      get:
 *          summary: Obtiene a todos los servicios eliminados en un arreglo de objetos
 *          tags:
 *              - Servicios
 *          description: Esta ruta se encarga de devolver a los servicios eliminados con todas sus propiedades en un arreglo de objetos

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
 *                                      example: "Servicios eliminados seleccionados correctamente"
 *                                  response:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                               nombre:
 *                                                  type: string
 *                                                  example: "Construccion de muros"
 *                                               created_at:
 *                                                  type: string
 *                                                  example: 2024-09-29T22:35:16.000Z
 *                                               updated_at:
 *                                                  type: string
 *                                                  example: 2024-09-29T22:35:16.000Z
 *                                               estado:
 *                                                  type: string
 *                                                  example: eliminado                                             
 *                                              
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
 *                                                  example: No existen servicios
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
router.get("/get-all-deleted", getAllDeleted);

/**
 * @swagger
 * /api/services/get-by-id/{nombre}:
 *      get:
 *          summary: Obtiene a un servicio segun su nombre
 *          tags:
 *              - Servicios
 *          description: Esta ruta se encarga de devolver a un servicio con todas sus propiedades en un objeto
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
 *                                      example: "Servicio obtenido correctamente"
 *                                  response:
 *                                          type: object
 *                                          properties:
 *                                               nombre:
 *                                                  type: string
 *                                                  example: "Revision de calidad de ventanas"
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
 *                                                  example: "+{asd"
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
 *                                                  example: Servicio no encontrada
 *                                              value:
 *                                                  type: string
 *                                                  example: "Lavado de autos"
 *                                              path:
 *                                                  type: string
 *                                                  example: nombre
 *                                              location:
 *                                                  type: string
 *                                                  example: params                                                                              
 *                                 
 */
router.get("/get-by-id/:nombre",
    param("nombre")
        .notEmpty().withMessage("El nombre esta vacio")
        .isString().withMessage("Tipo de dato incorrecto para el nombre")
        .customSanitizer(value => typeof value === "string" ? capitalizeWords(value) : value),
    handleInputErrors,
    getById);

export default router;