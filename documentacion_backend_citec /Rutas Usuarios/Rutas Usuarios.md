#usuarios #backend #crud 
### (POST) "backend-url/api/user/login"
#### Descripcion
- Esta ruta se usará para ingresar a la plataforma
- El request son solo el email y la contraseña
- Para el response, cambia dependiendo si existen errores o no
- Si exiten errores se devulve un arreglo de objetos con todos los errores

#### Request
```js
/*
@brief
"email": Se espera que se envie el email del usuario;
"contraseña": Se espera que se envie la contraseña del usuario
*/
Request (body):
{
    "email": "admin@gmail.com",
    "contraseña": "1234"
}
```

#### Response

```js
/*
@brief
"login_status": true si el correo y contraseña son correctos;
"response": respuesta que devuelve los datos del usuario que ingresó;
"email": email del usuario;
"nombre": nombre del usuario;
"apellido": apellido del usuario;
"contraseña": contraseña del usuario, ya hasheada;
"nombre_tipo": tipo de usuario (admin,cliente,etc);
"created_at": fecha de creacion del usuario;
*/
Response (status:200)("success"):
{
    "login_status": true,
    "response": {
        "email": "admin@gmail.com",
        "nombre": "admin",
        "apellido": "admin",
	    "contraseña":"$2b$10$l5rYh6AOY0J4iW3FBgxl6O5xAgN/
		Zt9EJAUKj0c9rpBdZFeL/35Wa",
        "nombre_tipo": "admin",
        "created_at": "2024-09-24T02:54:38.000Z"
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
            "msg": "Usuario o contraseña incorrecta",
            "value": "12345",
            "path": "contraseña",
            "location": "body"
        }
    ]
}
```

---

### (POST) "backend-url/api/user/create"
#### Descripcion
- En progreso