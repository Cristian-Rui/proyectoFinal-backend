import mongoose from "mongoose";

const messagesCollection = "messages"

const messageSchema = new mongoose.Schema({
    user: {
        required: true,
        type: String,
    },
    message: {
        required: true,
        type: String
    },
})

export const messageModel = mongoose.model(messagesCollection, messageSchema);