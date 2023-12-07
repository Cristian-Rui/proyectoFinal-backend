import * as fs from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path,
            this.products = []
    }

    static id = 1;


    //METODOS

    // VERIFICO SI EXISTE EL ARCHIVO PARA ELIMINARLO Y ASI EVITO QUE SE REPITAN LOS PRODUCTOS DENTRO DEL ARCHIVO.
    async reloadClean() {
        const fileExists = await fs.promises.access(this.path)
            .then(() => true)
            .catch(() => false);

        if (fileExists) {
            await fs.promises.unlink(this.path);
        }
    }

    async addProduct(product) {
        //VALIDACION CAMPOS OBLIGATTORIOS
        try {
            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
                console.error('Todos los campos son obligatorios.');
                return;
            }

            const newProduct = {
                id: ProductManager.id,
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock
            }

            const productExists = this.products.find(p => p.code === newProduct.code);
            if (productExists) {
                console.error('El código del producto ya está en uso.');
                return;
            }

            ProductManager.id++

            this.products.push(newProduct);

            await this.reloadClean();

            await fs.promises.writeFile(this.path, JSON.stringify(this.products), 'utf-8');

        } catch (error) {
            return console.error('error al cargar el producto', error);
        }

    }

    async getProducts() {
        try {
            const datos = await fs.promises.readFile(this.path, 'utf-8');
            const parseDatos = JSON.parse(datos);
            return parseDatos;
        } catch (error) {
            console.log('no hay datos');
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

    async updateProduct(idProduct, productToUpdate) {
        const searchProduct = await this.getProductById(idProduct);
        const update = {
            ...searchProduct,
            ...productToUpdate,
            id: idProduct
        }

        this.products.push(update);

        await this.reloadClean();
        await fs.promises.writeFile(this.path, JSON.stringify(this.products), 'utf-8');

    }

    async deleteProduct(idProduct) {

        const productList = await this.getProducts();

        const productToDelete = productList.find(p => p.id === idProduct);
        if (!productToDelete) {
            return console.error(`No se encontró ningún producto con el ID ${idProduct}`);
        }

        const productDelete = productList.filter(p => p.id !== idProduct);
        await this.reloadClean();
        await fs.promises.writeFile(this.path, JSON.stringify(productDelete), 'utf-8');
    }
}

export default ProductManager;