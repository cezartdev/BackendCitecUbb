#empresa #backend #crud 
### (POST) "backend-url/api/business/create"
#### Descripcion
- Esta ruta se encarga de crear a las empresas

#### Request
```js
/*
@brief
"rut": Rut de la empresa, es la clave primaria
"razon_social": Nombre frente al SII
"nombre_de_fantasia": nombre ficticio de la empresa
"email_factura": Email donde se envian los correos
"direccion": Dirección de la empresa escrita manualmente por el usuario
"comuna": "codigo territorial de la comuna"
"telefono": telefono de la empresa
*/
Request (body):
{
    "rut": "77.123.456-7",
    "razon_social": "Empresa Spa",
    "nombre_de_fantasia": "Construcciones el Pedro",
    "email_factura": "factura@gmail.com",
    "direccion": "calle o'higgins n°12",
    "comuna": "8103",
    "telefono": "+56912345678"
}
```

#### Response

```js
/*
@brief

*/
Response (status:200)("success"):
{
    "msg": "Empresa creada correctamente",
    "response": {
        "rut": "77.123.456-7",
        "razon_social": "Empresa Spa",
        "nombre_de_fantasia": "Construcciones el Pedro",
        "email_factura": "factura@gmail.com",
        "direccion": "calle o'higgins n°12",
        "comuna": 8103,
        "telefono": "+56912345678"
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
            "msg": "Ocurrio un error al crear a la empresa",
            "value": "11.23-",
            "path": "rut",
            "location": "body"
        }
    ]
}
```

---

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
        "razon_social": "Ingeniería y Construcción Techint Spa",
        "nombre_de_fantasia": "Techint",
        "email_factura": "factura@gmail.com",
        "dirección": "calle o'higgins n°267",
        "region": "Región del Biobío",
        "provincia": "Concepción",
        "comuna":"Concepción",
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
