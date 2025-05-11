import fs from "node:fs";
import { v4 as uuid } from "uuid";

class ProductManager {
  path;
  products = [];

  constructor({ path }) {
    this.path = path;

    if (fs.existsSync(path)) {
      try {
        this.products = JSON.parse(fs.readFileSync(path, "utf-8"));
      } catch (error) {
        console.error("Error al leer el archivo", error);
        this.products = [];
      }
    }
  }

  async saveOnFile() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2)
      );
    } catch (error) {
      console.error("Error saveOnFile");
    }
  }

  async getProducts() {
    return this.products;
  }

  async getProductById(pid) {
    const product = this.products.find((product) => product.id === pid.id);

    if (!product) {
      console.error(`No se encontró el producto con id ${pid.id}`);
      return;
    }
    return product;
  }

  async addProduct({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  }) {
    /* if (this.products.find((product) => product.code === code)) {
            console.log("Error: el codigo del producto ya existe");
            return;
          }*/

    const id = uuid();
    const newProduct = {
      id,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };
    this.products.push(newProduct);
    try {
      await this.saveOnFile();
      return newProduct;
    } catch (error) {
      console.error("Error al guardar el producto", error);
    }
  }

  async updateProduct({ pid }, updatedProduct) {
    const index = this.products.findIndex((product) => product.id === pid);
    if (index === -1) {
      console.error(`No se encontró el producto con id ${pid}`);
      return;
    }
    const product = this.products[index];

    product.title = updatedProduct.title ?? product.title;
    product.description = updatedProduct.description ?? product.description;
    product.code = updatedProduct.code ?? product.code;
    product.price = updatedProduct.price ?? product.price;
    product.status = updatedProduct.status ?? product.status;
    product.stock = updatedProduct.stock ?? product.stock;
    product.category = updatedProduct.category ?? product.category;
    product.thumbnails = updatedProduct.thumbnails ?? product.thumbnails;

    console.log(product);
    try {
      await this.saveOnFile();
      return this.products[index];
    } catch (error) {
      console.error("Error al actualizar el producto", error);
    }
  }

  async deleteProduct( pid ) {
    const index = this.products.findIndex((product) => product.id === pid.id);
    if (index === -1) {
      console.error(`No se encontró el producto con id ${pid.id}`);
      return;
    }
    this.products.splice(index, 1);
    try {
      await this.saveOnFile();
      return this.products;
    } catch (error) {
      console.error("Error 1 al eliminar el producto", error);
    }
  }
}

export const productManager = new ProductManager({
  path: "./src/data/products.json",
});
