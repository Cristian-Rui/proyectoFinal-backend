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
                return false
            };
            return { searchedCart };
        } catch (error) {
            console.error({ message: 'There was a problem finding the cart', error: error })
        }
    }

    async addCart() {
        try {
            const newCart = await cartModel.create({});
            return newCart;
        } catch (error) {
            console.error('There was a problem adding the cart', error);
        }
    };

    async addProductToCart(cartId, productId) {
        try {
            const cart = await cartModel.findOne({ _id: cartId });

            if (!cart) {
                console.error('nonexistent cart');
                return false;
            }

            const existingProduct = cart.products.find(p => p.product.equals(productId));

            if (existingProduct) {
                await cartModel.updateOne(
                    { _id: cartId, 'products.product': productId },
                    { $inc: { 'products.$.quantity': 1 } }
                );
            } else {
                await cartModel.updateOne(
                    { _id: cartId },
                    {
                        $addToSet: {
                            products: {
                                product: productId,
                                quantity: 1
                            }
                        }
                    }
                );
            }

            return true;
        } catch (error) {
            console.error('Error when adding product to cart:', error.message);
            return false;
        }
    }
    async getProductsOfCart(cartId) {
        try {
            const cartProductsList = await cartModel.find({ _id: cartId }, { products: 1 });
            if (!cartProductsList) {
                return (false, { message: 'There was a problem finding the cart' })
            }
            return cartProductsList;
        } catch {
            console.error({ message: 'There was a problem getting the products from the cart', error: error })
        }

    }
}


export default CartMongoManager;