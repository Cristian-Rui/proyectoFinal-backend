import { Router } from "express";
import ProductManager from "../ProductManager.js";

const viewsRoutes = Router();
const productManager = new ProductManager('./src/productos.json');
let productList = await productManager.getProducts();

viewsRoutes.get('/', (req, res) => {
    const { limit } = req.query;
    if (!limit){
        productList
    }else{
        productList = productList.splice(0, limit);
    }
    res.render('home', { productList });
})

viewsRoutes.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts')
})

export default viewsRoutes;