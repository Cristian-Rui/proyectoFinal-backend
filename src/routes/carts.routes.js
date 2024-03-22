import { Router } from "./router.js";
import CartMongoManager from "../dao/managerDB/CartMongoManager.js";

const cartMongoManager = new CartMongoManager();

export default class CartRoutes extends Router {
    init() {
        this.get('/', ['ADMIN'], async (req, res) => {
            try {
                const cartList = await cartMongoManager.getCarts();
                res.status(200).json(cartList);
            } catch (error) {
                res.status(500).json({ message: 'There was a problem', error: error });
            }
        });

        this.post('/', ['ADMIN'], async (req, res) => {
            try {
                await cartMongoManager.addCart();
                res.status(200).json({ message: 'cart created successfully' })
            } catch (error) {
                res.status(500).json({ message: 'There was a problem', error: error });
            }
        });

        this.get('/:cartId', ['ADMIN'], async (req, res) => {
            try {
                const { cartId } = req.params;

                const productsCartById = await cartMongoManager.getProductsOfCart(cartId)

                if (!productsCartById) {
                    return res.status(404).send({ message: 'Products not found' })
                };

                res.status(200).json(productsCartById)
            } catch (error) {
                res.status(500).json({ message: 'There was a problem', error: error });
            }
        });

        this.post('/:cartId/product/:productId', ['ADMIN'], async (req, res) => {
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

        this.delete('/:cartId/products/:productId', ['ADMIN'], async (req, res) => {
            try {
                const { cartId } = req.params;
                const { productId } = req.params;

                const deleteOneProduct = await cartMongoManager.deleteProductOfCart(cartId, productId);

                if (!deleteOneProduct) {
                    return res.status(400).send({ error: 'Error removing product from cart' });
                };

                res.status(200).json({ message: 'Product successfully removed' });

            } catch (error) {
                res.status(500).json({ message: 'There was a problem', error: error });
            };
        });

        this.delete('/:cartId', ['ADMIN'], async (req, res) => {
            try {
                const { cartId } = req.params;

                const deleteAllProducts = await cartMongoManager.deleteAllProductsOfCart(cartId);

                if (!deleteAllProducts) {
                    return res.status(400).send({ error: 'Error removing products from cart' });
                };

                res.status(200).json({ message: 'Products successfully removed' });

            } catch (error) {
                res.status(500).json({ message: 'There was a problem', error: error });
            }
        })

        this.put('/:cartId', ['ADMIN'], async (req, res) => {
            try {
                const { cartId } = req.params;
                const products = req.body;
                const updatedCart = await cartMongoManager.updateAllCart(cartId, products);

                if (!updatedCart) {
                    return res.status(400).send({ error: 'Error updating cart products' });
                };

                const productsOfCartList = await cartMongoManager.getProductsOfCart(cartId)

                productsOfCartList.map(async product => {
                    if (product.quantity <= 0) {
                        await cartMongoManager.deleteProductOfCart(cartId, product.product);
                    };
                });

                res.status(200).json({ message: 'Products successfully updated' });
            } catch (error) {
                res.status(500).json({ message: 'There was a problem', error: error });
            }
        })

        this.put('/:cartId/products/:productId', ['ADMIN'], async (req, res) => {
            try {
                const { cartId } = req.params;
                const { productId } = req.params;
                const { quantity } = req.body;

                const updatingProduct = await cartMongoManager.updateProductOfCart(cartId, productId, quantity);

                if (!updatingProduct) {
                    return res.status(400).send({ error: 'Error updating cart products' });
                }

                const productsOfCartList = await cartMongoManager.getProductsOfCart(cartId);

                const filteredList = productsOfCartList.filter(product => product.quantity <= 0)

                console.log(filteredList.length)

                if (filteredList.length !== 0) {
                    filteredList.map(product => cartMongoManager.deleteProductOfCart(cartId, product.product))
                }

                res.status(200).json({ message: 'Product successfully updated' });

            } catch (error) {
                res.status(500).json({ message: 'There was a problem', error: error });
            }
        })
    }
}