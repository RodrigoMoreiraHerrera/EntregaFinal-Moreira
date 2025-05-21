import { Router } from "express";
import { io } from "../index.js";
import { productModel } from "../models/product.model.js";

export const productsRoute = Router();

productsRoute.get("/", async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "error al obtener los productos" });
  }
});

productsRoute.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);

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
    thumbnails,
  } = req.body;

  const productExist = await productModel.findOne({ code });
  if (productExist) {
    return res.status(400).json({ error: "el producto ya existe route" });
  }

  let product = await productModel.insertOne({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  });
  io.emit("new-product", product);
  res.send({ status: "success", payload: product });
});

productsRoute.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const updatedProduct = req.body;
  try {
    const product = await productModel.findByIdAndUpdate(pid, updatedProduct, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ error: "producto no encontrado" });
    }
    io.emit("update-product", product);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "error al actualizar el producto" });
  }
});

productsRoute.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);
    const deleteProduct = await productModel.deleteOne({ _id: id });
    if (!deleteProduct) {
      return res.status(404).json({ error: "producto no encontrado" });
    }
    io.emit("delete-product", product);

    res.status(200).json(deleteProduct, product);
  } catch (error) {
    res.status(500).json({ error: "error 2 al eliminar el producto" });
  }
});
