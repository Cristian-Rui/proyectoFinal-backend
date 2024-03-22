import express from 'express'
import { Server } from "socket.io";
import handlebars from 'express-handlebars'
import mongoose from 'mongoose';
import ProductMongoManager from './dao/managerDB/ProductMongoManager.js';
import CartMongoManager from './dao/managerDB/CartMongoManager.js';
import { messageModel } from './dao/models/messages.models.js';
import SessionRoutes from './routes/session.routes.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import initializePassport from './config/passport.config.js';
import passport from 'passport';
import { secret } from './config/const.js';
import ProductRoutes from './routes/products.routes.js';
import CartRoutes from './routes/carts.routes.js';
import ViewsRoutes from './routes/views.routes.js';


const PORT = 8080;
const app = express();

const productMongoManager = new ProductMongoManager();
const cartMongoManager = new CartMongoManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: secret,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://cristianrui98:cristian3564332149@cristian.sevvzhl.mongodb.net/ecommerce',
    }),
    resave: true,
    saveUninitialized: true
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb+srv://cristianrui98:cristian3564332149@cristian.sevvzhl.mongodb.net/ecommerce')

const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
});

app.engine('handlebars', hbs.engine);
app.set('views', 'src/views');
app.set('view engine', 'handlebars');

const sessionRoutes = new SessionRoutes();
const productRoutes = new ProductRoutes();
const cartRoutes = new CartRoutes();
const viewsRoutes = new ViewsRoutes();

app.use('/api/products', productRoutes.getRouter());

app.use('/api/cart', cartRoutes.getRouter());

app.use('/api/session', sessionRoutes.getRouter());

app.use('/', viewsRoutes.getRouter());

const httpServer = app.listen(PORT, () => {
    console.log(`servidor funcionando en puerto ${PORT}`);
});



export const io = new Server(httpServer);

io.on('connection', socket => {
    socket.on('loadProducts', async () => {
        const info =  await productMongoManager.getProducts();
        const limit = info.totalDocs
        const productList = await productMongoManager.getProducts(limit);
        io.emit('update-products', productList.payload);
    });

    socket.on('delete-product', async (productID) => {
        try {
            await productMongoManager.deleteProduct(productID);
            const info =  await productMongoManager.getProducts();
            const limit = info.totalDocs
            const productList = await productMongoManager.getProducts(limit);
            io.emit('update-products', productList.payload);

        } catch (error) {
            console.error(error);
        };

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
        };

    });

    socket.on('newUser', data => {
        socket.broadcast.emit('notification', data);
    });

    socket.on('addProduct', async data => {
        try {
            const { cartId, productId, quantity } = data;

            const addedProduct = await cartMongoManager.addProductToCart(cartId, productId, quantity);

            if (!addedProduct) {
                console.error({ message: 'There was a problem adding the product to the cart' });
            };

            socket.emit('addedProduct');
        } catch (error) {
            console.error(error);
        };
    });
});