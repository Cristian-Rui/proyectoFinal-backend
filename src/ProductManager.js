import { error } from 'console';
import * as fs from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path
    }

    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || !product.category || !product.productStatus) {
            console.error('Todos los campos son obligatorios.');
            return false;
        }
        const productList = await this.getProducts();
        const idProduct = Date.now();

        const newProduct = {
            title: product.title,
            description: product.description,
            price: parseInt(product.price),
            thumbnail: product.thumbnail,
            code: product.code,
            stock: parseInt(product.stock),
            category: product.category,
            productStatus: product.productStatus,
            id: idProduct
        };

        const productExists = productList.find(p => p.code === newProduct.code);
        if (productExists) {
            console.error('El código del producto ya está en uso.');
            return false;
        };

        productList.push(newProduct);

        await fs.promises.writeFile(this.path, JSON.stringify(productList), 'utf-8');
        return true;
    }


    async getProducts() {
        try {
            const datos = await fs.promises.readFile(this.path, 'utf-8');
            const parseDatos = JSON.parse(datos);
            return parseDatos;
        } catch (error) {
            console.log('no hay datos en productos');
            return [];
        };
    }


    async getProductById(idProduct) {
        const productsList = await this.getProducts();
        const productExists = productsList.find(p => p.id === idProduct);

        if (!productExists) {
            return console.error('Not found')
        }

        return productExists;
    }


    async deleteProduct(idProduct) {
        const productList = await this.getProducts();

        if (!productList.some(p => p.id === idProduct)) {
            console.error(`No se encontró ningún producto con el ID ${idProduct}`);
            return false;
        };

        const productDelete = productList.filter(p => p.id !== idProduct);

        await fs.promises.writeFile(this.path, JSON.stringify(productDelete), 'utf-8');

        return true;
    }


    async updateProduct(idProduct, productToUpdate) {
        let productList = await this.getProducts();
        if (!productList.some(p => p.id === idProduct)) {
            console.error(`No se encontró ningún producto con el ID ${idProduct}`);
            return false;
        };

        const updatedProducts = productList.map(product => {
            if (product.id === parseInt(idProduct)) {
                return {
                    ...product,
                    ...productToUpdate,
                    id: idProduct
                }

            }
            return product;
        })

        await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts), 'utf-8');
    }
}

export default ProductManager;