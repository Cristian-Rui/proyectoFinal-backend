import { Router } from "express";
import { uploader } from '../utils/multer.js'
import ProductManager from "../ProductManager.js";



const productsRoutes = Router();
const productManager = new ProductManager('./src/productos.json')

let productList = await productManager.getProducts();

productsRoutes.get('/', async (req, res) => {
    const { limit } = req.query;



    if (!limit || limit >= productList.length) {
        return res.send({ productList });
    };

    const limitedList = productList.splice(0, limit);
    return res.send({ limitedList });

})

productsRoutes.get('/:pid', async (req, res) => {
    const { pid } = req.params;

    const productById = await productManager.getProductById(parseInt(pid));

    if (!productById) {
        return res.send({ error: 'el producto no existe' })
    }

    res.send({ productById })
})


productsRoutes.post('/', async (req, res) => {
    try {
        let product = req.body;
        console.log(productList);

        await productManager.addProduct(product);
        
        console.log(productList)
        
        res.send({ message: 'Producto agregado' });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).send({ error: 'Error al agregar el producto' });
    }
});




export default productsRoutes;