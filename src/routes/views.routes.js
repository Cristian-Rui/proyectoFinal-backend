import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";
import ProductMongoManager from "../dao/managerDB/ProductMongoManager.js";
import CartMongoManager from "../dao/managerDB/CartMongoManager.js";


const viewsRoutes = Router();
const productMongoManager = new ProductMongoManager();
const cartMongoManager = new CartMongoManager()

viewsRoutes.get('/', async (req, res) => {
    try {
        const productList = await productModel.find().lean();
        console.log(productList)
        res.status(200).render('home', { productList, title: 'Home', style: 'style.css' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'users not found' });
    }
})

viewsRoutes.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', { title: 'Cargar un producto', style: 'style.css' })
})

viewsRoutes.get('/chat', (req, res) => {
    res.render('chat', { title: 'Chat en vivo', style: 'style.css' });
});

viewsRoutes.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, query = '', sort = '' } = req.query;

        const productList = await productMongoManager.getProducts(limit, page, query, sort);

        if (productList.hasPrevPage) {
            productList.prevLink = `/products?limit=${limit}&page=${+page - 1}&query=${query}&sort=${sort}`;
        } else {
            productList.prevLink = null;
        };
        if (productList.hasNextPage) {
            productList.nextLink = `/products?limit=${limit}&page=${+page + 1}&query=${query}&sort=${sort}`;
        } else {
            productList.nextLink = null;
        };

        if (!productList) {
            res.status(404).json({ message: 'products not found' })
        };

        const payload = productList.payload;

        res.render('products', { payload, productList, title: 'Productos', style: 'style.css' });
    } catch (error) {
        res.status(500).json({ message: 'There was a problem', error: error });
    };
});

viewsRoutes.get('/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        const productToRender = await productMongoManager.getProductById(productId);

        res.render('product', { productToRender, title: `${productToRender.searchedProduct.title}`, style: 'product.css' });
    } catch (error) {
        res.status(500).json({ message: 'There was a problem', error: error });
    };
})

viewsRoutes.get('/carts/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;

        const productList = await cartMongoManager.getProductsOfCart(cartId);
        productList.forEach((product) => {
            product.totalPrice = product.product.price * product.quantity;
        })
        res.render('cart', { productList, title: 'Carrito', style: 'style.css' })

    } catch (error) {
        res.status(500).json({ message: 'There was a problem', error: error });
    }
})

export default viewsRoutes;