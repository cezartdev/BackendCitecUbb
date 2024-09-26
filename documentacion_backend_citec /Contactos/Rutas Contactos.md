#contacto #backend #crud 
### (GET) "backend-url/api/contact/get-by-id/:id"
#### Descripcion
- Debe entregar el contacto segun el id, o clave primaria

#### Request
```js
/*
@brief
"contacto@gmail.com": Esta es la clave primaria o id que se espera
*/
Request (url or params):

"backend-url/api/contact/get-by-id/contacto@gmail.com"
```

#### Response

```js
/*
@brief
"email": Es el email del contacto
"nombre": Devuelve el nombre del giro.
"cargo": Es el rango o posicion del contacto
"rut_empresa": Clave foranea de empresas
*/
Response (status:200)("success"):
{
    "response": {
        "email": "contacto@gmail.com",
        "nombre": "Juan",
        "cargo": "gerente",
        "rut_empresa": "77.876.536-1"
    },
}

/*
@brief
"errors": respuesta, arreglo de objetos que contienen todos los errores generados;
"type": tipo de error, generalmente describe si el error es de campo o no "field";
"msg": mensaje que describe el error;
"value": valor que generó el error;
"path": variable que generó el error;
"location": donde se generó el error;
*/
Response (status:300s || 400s || 500s)("error"):
{
    "errors": [
        {
            "type": "field",
            "msg": "contacto no encontrado",
            "value": "juan@gmail.com",
            "path": "id",
            "location": "url"
        }
    ]
}
```

---

### (GET) "backend-url/api/contact/get-all"
#### Descripcion
- Esta ruta devuelve todos los contactos
- Se devuelve un arreglo de objetos con todos los contactos.

#### Request
```js
/*
@brief
No se espera ningun parametro
*/
Request (url or params):

"backend-url/api/contact/get-all"
```

#### Response

```js
/*
@brief
Devuelve la informacion de todos los contactos en un arreglo de objetos
*/
Response (status:200)("success"):
{
    "response": [
        {
            "email": "contacto@gmail.com",
            "nombre": "Juan",
            "cargo": "gerente",
            "rut_empresa":"77.876.536-1"
        },
        {
            "email": "gerencia@gmail.com",
            "nombre": "Pedro",
            "cargo": "jefe de bodega",
            "rut_empresa":"77.869.874-5"
        },
    ]
}

/*
@brief
"errors": respuesta, arreglo de objetos que contienen todos los errores generados;
"type": tipo de error, generalmente describe si el error es de campo o no "field";
"msg": mensaje que describe el error;
"value": valor que generó el error;
"path": variable que generó el error;
"location": donde se generó el error;
*/
Response (status:300s || 400s || 500s)("error"):
{
    "errors": [
        {
            "type": "field",
            "msg": "error inesperado",
            "value": "desconocido",
            "path": "desconocido",
            "location": "frontend o backend"
        }
    ]
}
```

---
### (POST) "backend-url/api/contact/create"
#### Descripcion
- Esta ruta crea a un nuevo contacto
- Se devuelve la instancia del contacto creado con todos sus datos

#### Request
```js
/*
@brief

*/
Response (status:200)("success"):
{
    "response": {
        "nombre": "",
    }
}
```

#### Response

```js
/*
@brief
Devuelve la informacion de todos los contactos en un arreglo de objetos
*/
Response (status:200)("success"):
{
    "response": [
        {
            "email": "contacto@gmail.com",
            "nombre": "Juan",
            "cargo": "gerente",
            "rut_empresa":"77.876.536-1"
        },
        {
            "email": "gerencia@gmail.com",
            "nombre": "Pedro",
            "cargo": "jefe de bodega",
            "rut_empresa":"77.869.874-5"
        },
    ]
}

/*
@brief
"errors": respuesta, arreglo de objetos que contienen todos los errores generados;
"type": tipo de error, generalmente describe si el error es de campo o no "field";
"msg": mensaje que describe el error;
"value": valor que generó el error;
"path": variable que generó el error;
"location": donde se generó el error;
*/
Response (status:300s || 400s || 500s)("error"):
{
    "errors": [
        {
            "type": "field",
            "msg": "error inesperado",
            "value": "desconocido",
            "path": "desconocido",
            "location": "frontend o backend"
        }
    ]
}
```

---
