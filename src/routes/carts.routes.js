import { Router } from "express";
import { cartManager } from "../managers/carts.manager.js";



export const cartsRoute = Router();

cartsRoute.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ error: "error al obtener los carritos" });
    }
});

cartsRoute.post("/", async (req, res) => {
    try {
        const cart = await cartManager.addCart();
        res.status(201).json(cart);
    }
    catch (error) {
        res.status(500).json({ error: "error al crear el carrito" });
    }  
});     

cartsRoute.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getById({id: cid});
        res.status(200).json(cart);
    }catch (error) {
        res.status(500).json({ error: "error al obtener el carrito" });
    }});

cartsRoute.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await cartManager.postById({ id: cid, productId: pid, quantity });
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: "error al agregar producto al carrito" });
    }
});