import swaggerJSDoc from "swagger-jsdoc";


const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'Usuarios',
                description: 'Rutas relacionadas con los Usuarios'
            },
            {
                name: 'Tipos',
                description: 'Rutas relacionadas con los Tipos'
            },
            {
                name: 'Regiones',
                description: 'Rutas relacionadas con las Regiones'
            },
            {
                name: 'Provincias',
                description: 'Rutas relacionadas con las Provincias'
            },
            {
                name: 'Comunas',
                description: 'Rutas relacionadas con las Comunas'
            },
            {
                name: 'Empresas',
                description: 'Rutas relacionadas con las Empresas'
            },
            {
                name: 'Contactos',
                description: 'Rutas relacionadas con los Contactos'
            },
            {
                name: 'Giros',
                description: 'Rutas relacionadas con los Giros'
            },
            {
                name: 'Servicios',
                description: 'Rutas relacionadas con los servicios'
            },
            {
                name: 'Facturas',
                description: 'Rutas relacionadas con las facturas'
            },
            {
                name: 'Ordenes de trabajo',
                description: 'Rutas relacionadas con las ordenes de trabajo'
            }
        ],
        info: {
            title: '(REST API) Documentacion backend para proyecto Citec UBB',
            version: '1.0.0',
            description: 'Se usan las siguientes tecnologias:\n - TypeScript\n - Express\n - MySql\n\n - Jest\n\n - Node.js\n\n Codigo de estados:\n - 200 Solicitud exitosa (OK): Se devuelve la informacion correcta. Para metodos GET, DELETE, PATCH \n\n - 201 Recurso creado correctamente (Created): Para metodo POST o PUT y creacion de recursos en general  \n\n - 400 Peticion mal hecha (Bad Request): El Request se envio con los campos incorrectos \n\n - 403 No se poseen los permisos (Forbidden): El cliente o usuario no tiene los permisos necesarios \n\n - 404 No se encuentra el recurso (Not Found): El servidor no pudo encontrar el contenido solicitado \n\n - 409 Conflicto para devolver la informacion (Conflict): El recurso ya existe o esta duplicado. \n\n - 500 Error interno del servidor (Internal Server Error): El servidor no sabe como manejar el Request. Ruta no implementada o error inesperado'
        }
    },
    apis: ['./src/routes/*.{ts,js}']


}

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;