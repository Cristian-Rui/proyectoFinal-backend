import { Router } from "express";
//import CartManager from "../dao/managerFS/CartManager.js";
import CartMongoManager from "../dao/managerDB/CartMongoManager.js";

const cartRoutes = Router();
//const cartManager = new CartManager('./src/carts.json')
//const carts = await cartManager.getCarts()
const cartMongoManager = new CartMongoManager();

cartRoutes.get('/', async (req, res) => {
    try {
        const cartList = await cartMongoManager.getCarts();
        res.status(200).json(cartList);
    } catch (error) {
        res.status(500).json({ message: 'There was a problem', error: error });
    }
});

cartRoutes.post('/', async (req, res) => {
    try {
        await cartMongoManager.addCart();
        res.status(200).json({ message: 'cart created successfully' })
    } catch (error) {
        res.status(500).json({ message: 'There was a problem', error: error });
    }
});

cartRoutes.get('/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;

        const productsCartById = await cartMongoManager.getProductsOfCart(cartId)

        if (!productsCartById) {
            return res.status(404).send({ message: 'Products not found' })
        };

        res.status(200).json({ productsCartById })
    } catch (error) {
        res.status(500).json({ message: 'There was a problem', error: error });
    }
});

cartRoutes.post('/:cartId/product/:productId', async (req, res) => {
    try {
        const { cartId, productId } = req.params;

        const addingProduct = await cartMongoManager.addProductToCart(cartId, productId);

        if (!addingProduct) {
            return res.status(400).send({ error: 'Error when adding product to cart' })
        }

        res.status(200).json({ message: 'product successfully added' })
    } catch (error) {
        res.status(500).json({ message: 'There was a problem', error: error });
    }
})


export default cartRoutes;