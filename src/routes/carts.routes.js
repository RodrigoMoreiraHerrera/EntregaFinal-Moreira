import { Router } from "express";
import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";

export const cartsRoute = Router();

cartsRoute.get("/", async (req, res) => {
  try {
    const carts = await cartModel.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: "error al obtener los carritos" });
  }
});

cartsRoute.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findById(cid).populate("products.product");
    if (!cart) {
      return res.status(404).json({ error: "carrito no encontrado" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "error al obtener el carrito" });
  }
});

cartsRoute.post("/", async (req, res) => {
  try {
    const cart = await cartModel.create({ products: [] });
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: "error al crear el carrito" });
  }
});

cartsRoute.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    let cart = await cartModel.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $inc: { "products.$.quantity": quantity } },
      { new: true }
    );

    if (!cart) {
      cart = await cartModel.findByIdAndUpdate(
        cid,
        { $push: { products: { product: pid, quantity } } },
        { new: true }
      );
    }

    const product = await productModel.findById(pid);
    if (product.stock < quantity) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }
    product.stock -= quantity;
    await product.save();

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: "error al agregar producto al carrito" });
  }
});

cartsRoute.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findByIdAndUpdate(cid);
    if (!cart) {
      return res.status(404).json({ error: "carrito no encontrado" });
    }
    cart.products = [];
    await cart.save();
    res.status(200).json({ message: "carrito eliminado" });
  } catch (error) {
    res.status(500).json({ error: "error al eliminar el carrito" });
  }
});

cartsRoute.delete("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "carrito no encontrado" });
    }

    const cartProduct = cart.products.find(
      (item) => item.product.toString() === pid
    );
    const quantity = cartProduct ? cartProduct.quantity : 0;

    const updatedCart = await cartModel.findOneAndUpdate(
      { _id: cid },
      { $pull: { products: { product: pid } } },
      { new: true }
    );

    if (quantity > 0) {
      let product = await productModel.findById(pid);
      if (product) {
        product.stock += quantity;
        await product.save();
      }
    }

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "error al eliminar producto del carrito" });
  }
});
