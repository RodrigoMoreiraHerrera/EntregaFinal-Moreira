import { Router } from "express";
import { productModel } from "../models/product.model.js";
import { cartModel } from "../models/cart.model.js";

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

viewsRoutes.get("/cart/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartModel.findById(cid).populate("products.product").lean();
  const cartTotal = cart.products.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
  if (!cart) {
    return res.status(404).send("Carrito no encontrado");
  } else {
    res.render("cart", { cart, cartTotal });
  }
});

viewsRoutes.get("/product/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productModel.findById(pid).lean();
  if (!product) {
    return res.status(404).send("Product no encontrado");
  } else {
    res.render("product", { product });
  }
});

