import mongoose from "mongoose";


const cartCollection = "carts"

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    required: true,
                    ref: 'products'
                },
                quantity: Number
            }
        ],
        default: []
    }
})

cartSchema.pre('find', function(){
    this.populate('products.product');
});

export const cartModel = mongoose.model(cartCollection, cartSchema);