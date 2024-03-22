import mongoose from "mongoose";
import { cartModel } from "../models/carts.models.js";

class CartMongoManager {

    async getCarts() {
        try {
            const cartList = await cartModel.find().lean();
            return cartList;
        } catch (error) {
            console.error('There was a problem finding the carts', error);
            return [];
        };
    };

    async getCartById(cartId) {
        try {
            const searchedCart = await cartModel.find({ _id: cartId }).lean();
            if (!searchedCart) {
                return false;
            };
            return { searchedCart };
        } catch (error) {
            console.error({ message: 'There was a problem finding the cart', error: error });
        };
    };

    async addCart() {
        try {
            const newCart = await cartModel.create({});
            return newCart;
        } catch (error) {
            console.error('There was a problem adding the cart', error);
        };
    };

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await cartModel.findOne({ _id: cartId });

            if (!cart) {
                console.error('nonexistent cart');
                return false;
            };

            const existingProduct = cart.products.find(p => p.product.equals(productId));

            if (existingProduct) {
                await cartModel.updateOne(
                    { _id: cartId, 'products.product': productId },
                    { $inc: { 'products.$.quantity': quantity } }
                );
            } else {
                await cartModel.updateOne(
                    { _id: cartId },
                    {
                        $addToSet: {
                            products: {
                                product: productId,
                                quantity: quantity
                            }
                        }
                    }
                );
            };

            return true;
        } catch (error) {
            console.error('Error when adding product to cart:', error.message);
            return false;
        };
    };

    async getProductsOfCart(cartId) {
        try {
            const cartProductsList = await cartModel.find({ _id: cartId }, { "products": 1 });
            const products = cartProductsList.map(cart => cart.products);

            if (!cartProductsList) {
                return (false, { message: 'There was a problem finding the cart' });
            };

            return products[0];
        } catch(error) {
            console.error({ message: 'There was a problem getting the products from the cart', error: error });
        };
    };

    async deleteProductOfCart(cartId, productId) {
        try {
            const updatedCart = await cartModel.updateOne({ _id: cartId }, {
                $pull: { products: { product: new mongoose.Types.ObjectId(productId) } }
            });

            if (updatedCart.modifiedCount > 0) {
                return true;
            } else {
                return (false, { message: 'Error updating cart' });
            };
        } catch(error) {
            console.error({ message: 'There was a problem removing the product from the cart.', error: error });
        };


    };

    async deleteAllProductsOfCart(cartId) {
        try {
            const updatedCart = await cartModel.updateOne({ _id: cartId }, {
                products: []
            });
            if (updatedCart.modifiedCount > 0) {
                return true;
            }
            else {
                return (false, { message: 'Error updating cart' });
            }

        } catch(error) {
            console.error({ message: 'There was a problem removing products from the cart.', error: error });
        };

    };

    async updateAllCart(cartId, products) {
        try {
            const updatingProducts = await Promise.all(products.map(product => this.addProductToCart(cartId, product.product, product.quantity)));

            if (!updatingProducts) {
                return (false, { message: 'Error updating cart' })
            }

            return true;
        } catch (error) {
            console.error({ message: 'There was a problem updating the products in the cart.', error: error })
        };

    };

    async updateProductOfCart(cartId, productId, quantity) {
        try {
            const updatingProduct = await this.addProductToCart(cartId, productId, quantity)
            
            if (!updatingProduct) {
                return (false, { message: 'Error updating cart' })
            };

            return true;
        } catch(error) {
            console.error({ message: 'There was a problem updating the product in the cart.', error: error })
        };

    };
}


export default CartMongoManager;