import { Router } from "express";
import { uploader } from '../utils/multer.js'
import CartManager from "../CartManager.js";

const cartRoutes = Router();
const cartManager = new CartManager('./src/carts.json')
const carts = await cartManager.getCarts()

cartRoutes.get('/', async (req, res) => {
    return res.send(carts)
})

cartRoutes.post('/', async (req, res) => {
    const newCart = await cartManager.addCart();
    return res.send({ message: 'carrito creado con exito' })
})

cartRoutes.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cartById = await cartManager.getProductsOfCart(parseInt(cid))

        if (!cartById) {
            return res.status(404).send({ message: 'product not found' })
        };

        return res.send({ cartById })
    } catch (error) {
        return res.status(500).send({ error: 'error al obtener productos' });
    }
})

cartRoutes.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    const addingProduct = await cartManager.addProductToCart(parseInt(cid), parseInt(pid));

    if (!addingProduct) {
        return res.status(400).send({ error: 'error al agregar producto' })
    }

    res.send({ message: 'producto agregado con exito' })






})


export default cartRoutes;