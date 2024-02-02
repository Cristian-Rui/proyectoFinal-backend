import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";

const viewsRoutes = Router();


viewsRoutes.get('/', async (req, res) => {
    try {
        const productList = await productModel.find().lean();

        res.status(200).render('home', { productList });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'users not found' });
    }
})

viewsRoutes.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts')
})

viewsRoutes.get('/chat', (req, res) => {
    res.render('chat');
});

export default viewsRoutes;