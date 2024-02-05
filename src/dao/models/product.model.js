import mongoose, { Mongoose } from "mongoose";

const productCollection = 'products'

const productSchema = mongoose.Schema({
    title: { 
        required: true,
        type:String,
        index: true
    },
    description: {
        required: true, 
        type:String
    },
    price:{ 
        required: true,                                                                                                         
        type:Number,
        
    },
    thumbnail:{ 
        required: true,
        type:String
    },
    code: { 
        required: true,
        type:String,
        unique: true,
        index: true
    },
    stock:{ 
        required: true,
        type:Number
    },
    category:{ 
        required: true,
        type:String
    },
    productStatus:{ 
        required: true,
        type:Boolean,
    }
})


export const productModel = mongoose.model(productCollection, productSchema);