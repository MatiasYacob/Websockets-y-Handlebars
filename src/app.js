//Imports

import express from 'express';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';
import { Server, Socket } from 'socket.io';
import handlebars from "express-handlebars";
import {__dirname} from "./dirname.js"
import viewsRouter from "./routes/views.routes.js"
import ProductManager from './managers/ProductManager.js';
//Constantes
const app = express();
const port = 8080;
const pManager = new ProductManager("products.json");
//handleBars Config
app.engine("hbs",handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
}))

const httpServer = app.listen(port, () => 
console.log(`Servpidor Express corriendo en el puerto ${port}`)
);
const io = new Server(httpServer);
//Mpiddlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);
//Public
app.use('/public', (req, res, next) => {
    if (req.url.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    next();
  }, express.static(`${__dirname}/public`));
  
//Rutas




app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/', viewsRouter);

//IO
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("post_send", async (data) => {
        try {
            const product = {
                price: Number(data.price),
                stock: Number(data.stock),
                title: data.title,
                description: data.description,
                code: data.code,
                thumbnails: data.thumbnails,
                
            };

            console.log(product);
            await pManager.addProduct(product);
            socket.emit("productos", pManager.getProducts())
        } catch (error) {
            console.log(error);
        }
    });

    socket.emit("productos", pManager.getProducts())
});

  
  io.on("error", (error) => {
    console.error("Error en Socket.IO:", error);
    
  });
  

