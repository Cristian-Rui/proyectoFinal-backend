import { Router } from "express";
import { uploader } from '../utils/multer.js'
//import ProductManager from "../dao/managerFS/ProductManager.js";
import { io } from '../app.js';
import ProductMongoManager from "../dao/managerDB/ProductMongoManager.js";


const productsRoutes = Router();
//const productManager = new ProductManager('./src/productos.json')
const productMongoManager = new ProductMongoManager();

productsRoutes.get('/', async (req, res) => {
    try {
        productList = await productMongoManager.getProducts();
        res.status(200).render('home', { productList });
    } catch (error) {
        res.status(500).json({ message: 'There was a problem', error: error });
    }

})

productsRoutes.get('/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        const productById = await productMongoManager.getProductById(productId);

        if (!productById) {
            return res.status(404).send({ message: 'product not found' })
        };

        res.status(200).json({ productById });
    } catch (error) {
        res.status(500).json({ message: 'There was a problem', error: error });
    }
})


productsRoutes.post('/', uploader.single('thumbnail'), async (req, res) => {
    let  product  = req.body;
    const path = req.file.path.split('public').join('');

    try {
        const addingProduct = await productMongoManager.addProduct({ ...product, thumbnail: path })

        if (!addingProduct) {
            return res.status(400).json({ message: 'There was a problem adding the product' })
        }

        io.emit('update-products', await productMongoManager.getProducts());

        res.status(201).redirect('/realtimeproducts');
    } catch (error) {
        res.status(500).json({ message: 'There was a problem', error: error });
    };
});


productsRoutes.put('/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        let propertiesToUpdate = req.body;

        let productUpdated = await productMongoManager.updateProduct(productId, propertiesToUpdate);

        if (!productUpdated) {
            return res.status(404).json({ error: 'There was a problem finding the product' });
        }
        res.status(200).json({ message: 'Product updated' });

    } catch (error) {
        res.status(500).json({ message: 'There was a problem', error: error });
    }
});

productsRoutes.delete('/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        let productDeleted = await productMongoManager.deleteProduct(productId);

        if (!productDeleted) {
            return res.status(404).json({ error: 'There was a problem finding the product' });
        }

        res.status(200).json({ message: 'Product deleted' });
    } catch {
        res.status(500).json({ message: 'There was a problem', error: error });
    }

})



export default productsRoutes;