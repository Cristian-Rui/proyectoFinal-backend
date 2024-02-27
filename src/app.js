import express from 'express'
import { Server } from "socket.io";
import handlebars from 'express-handlebars'
import productsRoutes from './routes/products.routes.js';
import cartRoutes from './routes/carts.routes.js';
import mongoose from 'mongoose';
import ProductMongoManager from './dao/managerDB/ProductMongoManager.js';
import CartMongoManager from './dao/managerDB/CartMongoManager.js';
import { messageModel } from './dao/models/messages.models.js';
import viewsRoutes from './routes/views.routes.js';
import sessionRoutes from './routes/session.routes.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';


const PORT = 8080;
const app = express();

const productMongoManager = new ProductMongoManager();
const cartMongoManager = new CartMongoManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'Cr1st1anRv1',
    store: MongoStore.create({
        mongoUrl:'mongodb+srv://cristianrui98:cristian3564332149@cristian.sevvzhl.mongodb.net/ecommerce',
    }),
    resave: true,
    saveUninitialized: true
}));

mongoose.connect('mongodb+srv://cristianrui98:cristian3564332149@cristian.sevvzhl.mongodb.net/ecommerce')

const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
});

app.engine('handlebars', hbs.engine);
app.set('views', 'src/views');
app.set('view engine', 'handlebars');


app.use('/api/products', productsRoutes);

app.use('/api/cart', cartRoutes);

app.use('/api/session', sessionRoutes);

app.use('/', viewsRoutes);

const httpServer = app.listen(PORT, () => {
    console.log(`servidor funcionando en puerto ${PORT}`);
});



export const io = new Server(httpServer);

io.on('connection', socket => {
    socket.on('loadProducts', async () => {
        const productList = await productMongoManager.getProducts();
        io.emit('update-products', productList.payload)

    })

    socket.on('delete-product', async (productID) => {
        try {
            await productMongoManager.deleteProduct(productID);
            const productList = await productMongoManager.getProducts();
            io.emit('update-products', productList.payload);

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

    socket.on('newUser', data => {
        socket.broadcast.emit('notification', data);
    });

    //products socket 

    socket.on('newCart', async () => {
        try {
            const newCart = await cartMongoManager.addCart()
            socket.emit('newCart', newCart)
        } catch (error) {
            console.error(error);
        };
    });

    socket.on('addProduct', async data => {
        try {
            const { cartId, productId, quantity } = data;

            const addedProduct = await cartMongoManager.addProductToCart(cartId, productId, quantity);

            if (!addedProduct) {
                console.error({ message: 'There was a problem adding the product to the cart' })
            };

            socket.emit('addedProduct')
        } catch (error) {
            console.error(error);
        };
    });
});