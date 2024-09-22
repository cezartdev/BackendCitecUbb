## (POST) "backend-url/api/"

#### Descripcion
- Esta ruta debe...

#### Request
```js
Request (body):
{
    "rut": "11.111.111-1",
    "name": "Juan",
    "last_name":"Perez"
}
```

#### Response

```js
Response (status:200)("success"):
{
    "msg": "Exito",
    "name": "Juan",
    "type": "admin"
}

Response (status:300s || 400s || 500s)("error"):
{
    "msg": "Error..."
}
```
