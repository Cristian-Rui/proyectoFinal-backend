import * as fs from 'fs';
import ProductManager from '../ProductManager.js';
const productManager = new ProductManager('./src/productos.json')

//MIDDLEWARES
const checkProduct = (req, res, next) => {
    const { title, description, price, code, stock, category, status } = req.body;
    console.log({ title, description, price, code, stock, category, status });
    if (!title || !description || !price || !code || !stock || !category || !status) {
        return res.status(400).send({ message: 'Incomplete product' })
    }
    next();
};

export { checkProduct };