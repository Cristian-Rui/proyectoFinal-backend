import * as fs from 'fs';

class CartManager {
    constructor(path) {
        this.path = path
    }

    async addCart() {
        const cartList = await this.getCarts();
        const idCarts = Date.now();

        let newCart = {
            idCart: idCarts,
            products: []
        }

        cartList.push(newCart);

        await fs.promises.writeFile(this.path, JSON.stringify(cartList), 'utf-8');

    }

    async getCarts() {
        try {
            const datos = await fs.promises.readFile(this.path, 'utf-8');
            const parseDatos = JSON.parse(datos);
            return parseDatos;
        } catch (error) {
            console.log('no hay datos');
            return [];
        };

    }

    async getProductsOfCart(cartId) {
        const cartList = await this.getCarts();
        const selectedCart = await cartList.find(cart => cart.idCart === parseInt(cartId));

        if (!selectedCart) {
            console.error(`No se encontró ningún carrito con el ID ${cartId}`);
            return false;
        };

        return selectedCart.products;
    }

    async addProductToCart(cartId, productId) {
        try {
            let cartList = await this.getCarts();
            let addedProduct = {
                id: productId,
                quantity: 1
            };

            const updatedcart = cartList.map(cart => {
                if (cart.idCart === cartId) {
                    const productExists = cart.products.find(p => p.id === +productId)
                    if (productExists) {
                        productExists.quantity++;
                    } else {
                        cart.products.push(addedProduct);
                    }
                }
                return cart;
            });

            await fs.promises.writeFile(this.path, JSON.stringify(updatedcart), 'utf-8');
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }


    }

}


export default CartManager;