import { Router } from "./router.js";
import { uploader } from '../utils/multer.js'
import { io } from '../app.js';
import ProductMongoManager from "../dao/managerDB/ProductMongoManager.js";

const productMongoManager = new ProductMongoManager();

export default class ProductRoutes extends Router {
    init() {
        this.get('/', ['ADMIN'], async (req, res) => {
            try {
                const { limit = 10, page = 1, query = '', sort = '' } = req.query;

                const productList = await productMongoManager.getProducts(limit, page, query, sort);

                if (productList.hasPrevPage) {
                    productList.prevLink = `/api/products?limit=${limit}&page=${+page - 1}&query=${query}&sort=${sort}`;
                } else {
                    productList.prevLink = null;
                };
                if (productList.hasNextPage) {
                    productList.nextLink = `/api/products?limit=${limit}&page=${+page + 1}&query=${query}&sort=${sort}`;
                } else {
                    productList.nextLink = null;
                }

                if (!productList) {
                    res.status(404).json({ message: 'products not found' })
                }

                res.status(200).send({ productList });
            } catch (error) {
                res.status(500).json({ message: 'There was a problem', error: error });
            }

        })

        this.get('/:productId', ['ADMIN'], async (req, res) => {
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


        this.post('/',['ADMIN'], uploader.single('thumbnail'), async (req, res) => {
            let product = req.body;

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


        this.put('/:productId',['ADMIN'], async (req, res) => {
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

        this.delete('/:productId',['ADMIN'], async (req, res) => {
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
    }
}