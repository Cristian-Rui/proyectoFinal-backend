import { productModel } from "../models/product.model.js";

class ProductMongoManager {

    async getProducts(limit = 10, page = 1, query = '', sort = '') {
        try {
            const [code, value] = query.split(':');
            const productList = await productModel.paginate({ [code]: value }, {
                limit,
                page,
                sort: sort ? { price: sort } : {}
            });
            productList.payload = productList.docs;
            delete productList.docs;
            return { ...productList };
        } catch (error) {
            console.error('products not found');
            return [];
        };
    };

    async addProduct(product) {
        try {
            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || !product.category || !product.productStatus) {
                console.error('Todos los campos son obligatorios.');
                return false;
            };

            if (product.productStatus === 'true') {
                product.productStatus = true;
            } else {
                product.productStatus = false
            }

            const addedProduct = await productModel.create(product);

            return true;
        } catch (error) {
            console.error({ message: "ERROR" }, error)
            return false;
        }
    }

    async getProductById(idProduct) {

        try {
            const searchedProduct = await productModel.findOne({ _id: idProduct }).lean()
            if (searchedProduct) {
                return { searchedProduct };
            } else {
                return (false, { message: "product not found" });
            }
        } catch (error) {
            return (false, { message: "ERROR" }, error);
        }
    }

    async deleteProduct(idProduct) {
        try {
            const deletedProduct = await productModel.deleteOne({ _id: idProduct });
            if (deletedProduct) {
                return true;
            } else {
                return (false, { message: "product not found" });
            }
        } catch (error) {
            return (false, { message: "ERROR" }, error);
        }

    }

    async updateProduct(idProduct, propertiesToUpdate) {
        try {
            const updatedProduct = await productModel.updateOne({ _id: idProduct }, propertiesToUpdate);

            if (updatedProduct.modifiedCount > 0) {
                return true;
            }

            return (false, { message: "product not found" });
        } catch (error) {
            return (false, { message: "ERROR" }, error);
        }

    }
}

export default ProductMongoManager;