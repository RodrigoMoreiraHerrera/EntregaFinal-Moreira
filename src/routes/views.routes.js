import { Router } from "express";
import { productModel } from "../models/product.model.js";

export const viewsRoutes = Router();

viewsRoutes.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    lean: true,
  };
  const productsDocs = await productModel.paginate({}, options);
  const products = productsDocs.docs;
  console.log(productsDocs);
  res.render("home", { products, realtimeUrl: "/realtimeproducts" });
});

viewsRoutes.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});
