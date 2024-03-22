import { Router } from "./router.js";
import ProductMongoManager from "../dao/managerDB/ProductMongoManager.js";
import CartMongoManager from "../dao/managerDB/CartMongoManager.js";
import passport from "passport";
import jwt from 'jsonwebtoken'


const productMongoManager = new ProductMongoManager();
const cartMongoManager = new CartMongoManager()

export default class ViewsRoutes extends Router {

    init() {
        this.get('/',['USER', 'ADMIN'],passport.authenticate('jwt', {session: false}), async (req, res) => {
            try {
                const  user  = req.user;
                res.status(200).render('home', { user, title: 'Home', style: 'style.css' });
            } catch (error) {
                console.error(error);
                res.status(400).json({ message: 'users not found' });
            }
        })

        this.get('/realTimeProducts', ['ADMIN'], (req, res) => {
            res.render('realTimeProducts', { title: 'Cargar un producto', style: 'style.css' })
        })

        this.get('/chat', ['USER','ADMIN'], (req, res) => {
            res.render('chat', { title: 'Chat en vivo', style: 'style.css' });
        });

        this.get('/products',['PUBLIC'], async (req, res) => {
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

        this.get('/products/:productId',['PUBLIC'], async (req, res) => {
            try {
                const { productId } = req.params;

                const productToRender = await productMongoManager.getProductById(productId);

                res.render('product', { productToRender, title: `${productToRender.searchedProduct.title}`, style: 'product.css' });
            } catch (error) {
                res.status(500).json({ message: 'There was a problem', error: error });
            };
        })

        this.get('/carts/:cartId',['USER','ADMIN'], async (req, res) => {
            try {
                const { cartId } = req.params;

                const productList = await cartMongoManager.getProductsOfCart(cartId);
                productList.forEach((product) => {
                    product.totalPrice = (product.product.price * product.quantity).toFixed(2);
                })
                res.render('cart', { productList, title: 'Carrito', style: 'style.css' })

            } catch (error) {
                res.status(500).json({ message: 'There was a problem', error: error });
            }
        });

        this.get('/register', ['PUBLIC'], (req, res) => {
            res.render('register');
        });

        this.get('/login', ['PUBLIC'], (req, res) => {
            res.render('login');
        });

        this.get('/restorepassword', ['PUBLIC'], (req, res) => {
            res.render('restorepassword');
        });

    }
}