import mongoose from "mongoose";

const productCollection = 'productos'

const productSchema = mongoose.Schema({
    title: { 
        required: true,
        type:String,
        unique: true
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
        type:String,
        unique: true
    },
    code: { 
        required: true,
        type:String,
        unique: true
    },
    stock:{ 
        required: true,
        type:Number
    },
    category:{ 
        required: true,
        type:String
    },
    status:{ 
        required: true,
        type:Boolean,
    }
})