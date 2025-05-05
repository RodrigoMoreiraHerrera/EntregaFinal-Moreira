
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

const products = JSON.parse(fs.readFileSync(productManager.path, "utf-8"));

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



const server = app.listen(PORT, () => 
    console.log(`Server running on port http://localhost:${PORT}`));

export const io = new Server(server);

io.on("connection", (socket) => {
    console.log("New connection", socket.id);

    socket.emit("init", products);
});