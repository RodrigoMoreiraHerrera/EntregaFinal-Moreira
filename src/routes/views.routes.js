import { Router } from "express";
import fs from "node:fs"
import { productManager } from "../managers/products.manager.js";

export const viewsRoutes = Router();

const products = JSON.parse(fs.readFileSync(productManager.path, "utf-8"));

viewsRoutes.get("/", (req, res) => {
    res.render("home", { products });
});

viewsRoutes.get("/products", (req, res) => {
    res.render("realtimeproducts", );
});
