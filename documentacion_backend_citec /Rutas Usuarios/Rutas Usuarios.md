#usuarios #backend #crud 
### (POST) "backend-url/api/user/login"
#### Descripcion
- Esta ruta se usará para ingresar a la plataforma


#### Request
```js
Request (body):
{
    "email": "admin@gmail.com",
    "contraseña": "1234"
}
```

#### Response

```js
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

Response (status:300s || 400s || 500s)("error"):
{
    
}
```
