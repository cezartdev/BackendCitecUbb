#empresa #backend #crud 
### (GET) "backend-url/api/business/get-by-id/:id"
#### Descripcion
- Se devuelve a una sola empresa segun la clave primaria

#### Request
```js
/*
@brief
"77.123.456-7": Este es el rut de la empresa que es enviado a través de la url
*/
Request (url or params):

"backend-url/api/business-line/get-by-id/77.123.456-7"
```

#### Response

```js
/*
@brief
Devuelve todos los datos de la empresa
*/
Response (status:200)("success"):
{
    "response": {
        "rut": "77.123.456-7",
        "razon_social": "Empresa Spa",
        "nombre_de_fantasia": "Panaderia el tony",
        "email_factura": "factura@gmail.com",
        "dirección": "calle o'higgins n°267",
        "region": 1,
        "provincia": 1,
        "comuna":2,
        "telefono": "+56912345678",
        "contactos":[
        {
            "email": "contacto1@gmail.com",
            "nombre": "Juan",
            "cargo": "gerente",
            "rut_empresa": "77.123.456-7"
        },
        {
            "email": "contacto2@gmail.com",
            "nombre": "Pedro",
            "cargo": "bodega",
            "rut_empresa": "77.123.456-7"
        }
    ]
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
            "msg": "rut de empresa incorrecto",
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
            "msg": "codigo del giro incorrecto",
            "value": "11123",
            "path": "id",
            "location": "url"
        }
    ]
}
```

---
