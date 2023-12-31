import { Router } from "express";
import { uploader } from '../utils/multer.js'
import ProductManager from "../ProductManager.js";

const productsRoutes = Router();
const productManager = new ProductManager('./src/productos.json')

let productList = await productManager.getProducts();

productsRoutes.get('/', async (req, res) => {
    console.log(productList)
    res.render('home', { productList });
})

productsRoutes.get('/:pid', async (req, res) => {
    const { pid } = req.params;

    const productById = await productManager.getProductById(parseInt(pid));

    if (!productById) {
        return res.status(404).send({ message: 'product not found' })
    };

    res.send({ productById })
})


productsRoutes.post('/', uploader.single('thumbnail'), async (req, res) => {
    try {
        let product = JSON.parse(JSON.stringify(req.body))
        const path = req.file.path.split('public').join('');

        const addingProduct = await productManager.addProduct({ ...product, thumbnail: path });

        if (!addingProduct) {
            return res.status(400).send({ error: 'error al agregar el producto, verifique que esten los campos completos o que el codigo sea valido' });
        }

        res.send({ message: 'Producto agregado' });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).send({ error: 'Error al agregar el producto' });
    }
});


productsRoutes.put('/:pid', async (req, res) => {
    try {
        let productToUpdate = req.body;
        const id = req.params;

        let productUpdated = await productManager.updateProduct(parseInt(id.pid), productToUpdate);

        if (!productUpdated) {
            return res.status(404).send({ error: 'product not found' });
        }
        return res.send({ message: 'Producto actualizado' });

    } catch (error) {
        console.error(error)
        return res.status(500).send({ error: 'Error al agregar el producto' });
    }
});

productsRoutes.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;

        let productDeleted = await productManager.deleteProduct(parseInt(pid));

        if (!productDeleted) {
            return res.status(404).send({ error: 'product not found' });
        }

        return res.send({ message: 'producto eliminado con exito' });
    } catch {
        console.error('no se pudo eliminar el producto', error);
        return res.status(400).send({ error: 'error al eliminar el producto' });

    }

})



export default productsRoutes;