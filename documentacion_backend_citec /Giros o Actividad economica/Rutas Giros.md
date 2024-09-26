#giros #backend #crud 
### (GET) "backend-url/api/business-line/get-by-id/:id"
#### Descripcion
- Debe entregar el giro segun el codigo proporcionado

#### Request
```js
/*
@brief
"239200": Este es el codigo del giro que es enviado a través de la url
*/
Request (url or params):

"backend-url/api/business-line/get-by-id/239200"
```

#### Response

```js
/*
@brief
"nombre": Devuelve el nombre del giro
*/
Response (status:200)("success"):
{
    "response": {
        "codigo": "239200",
        "nombre": "FABRICACIÓN DE MATERIALES DE CONSTRUCCIÓN DE ARCILLA"
    }
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
            "msg": "giro no encontrado",
            "value": "11123",
            "path": "id",
            "location": "url"
        }
    ]
}
```

---

### (GET) "backend-url/api/business-line/get-all"
#### Descripcion
- Esta ruta devuelve todos los giros
- Se devuelve un arreglo de objetos con todos los giros.

#### Request
```js
/*
@brief
No se espera ningun parametro
*/
Request (url or params):

"backend-url/api/business-line/get-all"
```

#### Response

```js
/*
@brief
"nombre": Devuelve la informacion de todos los giros
*/
Response (status:200)("success"):
{
    "response": [
        {
            "codigo": "239200",
            "nombre": "FABRICACIÓN DE MATERIALES DE CONSTRUCCIÓN DE ARCILLA",
        },
        {
            "codigo": "239500",
            "nombre": "FABRICACIÓN DE ARTÍCULOS DE HORMIGÓN, CEMENTO Y YESO",
        }
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
