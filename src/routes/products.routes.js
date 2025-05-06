import { Router } from "express";
import { productManager } from "../managers/products.manager.js";
import { io } from "../index.js";

export const productsRoute = Router();

productsRoute.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "error al obtener los productos" });
    }
});

productsRoute.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productManager.getProductById({ id });

        if (!product) {
            return res.status(404).json({ error: "producto no encontrado" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: `error al obtener el productos id: ${id} ` });
    }
});

productsRoute.post("/", async (req, res) => {
    const { 
        title,
        description,        
        code,       
        price,       
        status,        
        stock,       
        category,       
        thumbnails
     } = req.body;

    try {
        const product = await productManager.addProduct({
            title,
            description,        
            code,       
            price,       
            status,        
            stock,       
            category,       
            thumbnails
        });
        
        io.emit("new-product", product);

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: "error al guardar el producto" });
    }
});

productsRoute.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { updatedProduct } = req.body;
    try {
        const product = await productManager.updateProduct({
            pid,
            updatedProduct,
        });
        if (!product) {
            return res.status(404).json({ error: "producto no encontrado" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "error al actualizar el producto" });
    }
});

productsRoute.delete("/:pid", async (req, res) => {
    const  {pid}  = req.params;
    try {
        const product = await productManager.getProductById({ pid })
        const deleteProduct = await productManager.deleteProduct( {pid} );
        if (!deleteProduct) {
            return res.status(404).json({ error: "producto no encontrado" });
        }
        io.emit("delete-product", product);

        res.status(200).json(deleteProduct);
    } catch (error) {
        res.status(500).json({ error: "error 2 al eliminar el producto" });
    }
});
