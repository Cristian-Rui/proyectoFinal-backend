import mongoose from "mongoose";

const userCollection = 'users';

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        required: true,
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

export const userModel = mongoose.model(userCollection, userSchema);