
import path from "path";
import fs from "fs";

import express from "express";
import { Server } from "socket.io";
import Handlebars from "express-handlebars";

import { __dirname } from "./utils.js";

import { viewsRoutes } from "./routes/views.routes.js";
import { productsRoute } from "./routes/products.routes.js";
import { cartsRoute } from "./routes/carts.routes.js";

import { productManager } from "./managers/products.manager.js";


import mongoose from "mongoose";
import { productModel } from "./models/product.model.js";


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));

// HANDLEBARS

app.engine(
    "hbs",
    Handlebars.engine({
        extname: ".hbs",
        defaultLayout: "main",

    })
);
app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "./views"));

// RUTES
app.use("/", viewsRoutes);
app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);


mongoose.connect("mongodb+srv://rodrigomh11:EOyzGoDTZT1hM9zN@cluster0.4k0vr.mongodb.net/Backend1")
.then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});


const server = app.listen(PORT, () => 
    console.log(`Server running on port http://localhost:${PORT}`));

export const io = new Server(server);

io.on("connection", async (socket) => {
    console.log("New connection", socket.id);
    const products = await productModel.find();
    socket.emit("init", products);
});