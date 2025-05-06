# COMANDO EJECUCION

```bash
npm run dev
```


# REQUEST HTTP PRODUCTS

## GET devuelve todos los productos

```bash
localhost:8080/api/products
```


## POST agrega un producto

```bash
localhost:8080/api/products
```

Body:

```bash
{
     "title": "Monitor Ultra HD",
    "description": "Monitor de 27 pulgadas con resolución 4K y tecnología HDR.",
    "code": "MON012",
    "price": 500,
    "status": true,
    "stock": 15,
    "category": "Tecnología",
    "thumbnails": ["https://th.bing.com/th/id/OIP.JWAd7uCvanrU28RgzzZvIwHaE8?rs=1&pid=ImgDetMain"]
}
```


## DELETE elimana un producto con el id

```bash
localhost:8080/api/products/[ID DEL PRODUCTO]
```

