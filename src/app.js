import express from 'express'
import { Server } from "socket.io";
import handlebars from 'express-handlebars'
import productsRoutes from './routes/products.routes.js';
import cartRoutes from './routes/carts.routes.js';
import viewsRoutes from './routes/views.routes.js';
//import ProductManager from './dao/managerFS/ProductManager.js';
import mongoose from 'mongoose';
import ProductMongoManager from './dao/managerDB/ProductMongoManager.js';
import CartMongoManager from './dao/managerDB/CartMongoManager.js';
import { messageModel } from './dao/models/messages.models.js';

const PORT = 8080;
const app = express();
//const productManager = new ProductManager('./src/productos.json')
const productMongoManager = new ProductMongoManager();
const cartMongoManager = new CartMongoManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb+srv://cristianrui98:cristian3564332149@cristian.sevvzhl.mongodb.net/ecommerce')

app.engine('handlebars', handlebars.engine());
app.set('views', 'src/views');
app.set('view engine', 'handlebars');


app.use('/api/products', productsRoutes);

app.use('/api/cart', cartRoutes);

app.use('/', viewsRoutes);

const httpServer = app.listen(PORT, () => {
    console.log(`servidor funcionando en puerto ${PORT}`);
});


export const io = new Server(httpServer);

io.on('connection', socket => {
    socket.on('loadProducts', async () => {
        io.emit('update-products', await productMongoManager.getProducts())
    })

    socket.on('delete-product', async (productID) => {

        try {
            await productMongoManager.deleteProduct(productID);
            io.emit('update-products', await productMongoManager.getProducts());

        } catch (error) {
            console.error(error);
        }

    });

    // chat sockets
    socket.on('message', async data => {
        try {
            const { user, message } = data;
            const newMessage = await messageModel.create({ user, message });
            
            const allMessages = await messageModel.find({});

            io.emit('allMessages', allMessages);

        } catch (error) {
            console.error(error);
        }

    });

    socket.on('newUser', data =>{
        io.emit('newConnection', 'un nuevo usuario se conecto');
        socket.broadcast.emit('notification', data);
    })

})