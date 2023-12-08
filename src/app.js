import express from 'express'
import productsRoutes from './routes/products.routes.js';
import cartRoutes from './routes/carts.routes.js';

const PORT = 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/products', productsRoutes);

app.use('/api/cart', cartRoutes);



app.listen(PORT, () => {
    console.log(`servidor funcionando en puerto ${PORT}`);
});