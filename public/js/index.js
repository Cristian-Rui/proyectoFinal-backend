const socket = io();

const form = document.getElementById('form_product')

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console
    try {
        const product = {
            title: form.title.value,
            description: form.description.value,
            price: form.price.value,
            thumbnail: form.thumbnail.value,
            code: form.code.value,
            stock: form.stock.value,
            category: form.category.value,
            productStatus: form.productStatus.value,
        };
        console.log(product)
        socket.emit('new-product', product);

    } catch (error) {
        console.error(error);

    } finally {
        form.reset();
    }
});

socket.on('update-products', (products) => {
    const productList = document.getElementById('seccion_product');
    productList.innerHTML = '';

    products.forEach((product) => {
        productList.innerHTML += `
        <div class="card col-4 m-1">
            <img src="${product.thumbnail}" class="card-img-top img-fluid" alt="${product.title}">
            <div class="card-body">
                    <h3 class="card-title">${product.title}</h3>
                    <h4 class="card-title">precio: $${product.price.toFixed(2)}</h4>
                    <p class="card-text">${product.description}</p>
            </div>
            <ul class="list-group list-group-flush">
                    <li class="list-group-item">codigo:${product.code}</li>
                    <li class="list-group-item">stock: ${product.stock}</li>
                    <li class="list-group-item">categoria: ${product.category}</li>
            </ul>
            <div class="card-body">
                    <button type="button" class="btn btn-success" id="btnComprar">comprar</button>
                    <button type="button" class="btn btn-danger" id="btnEliminar">eliminar</button>
            </div>
        </div>
        `;
    })
});
