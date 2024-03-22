const socket = io();

const form = document.getElementById('form');

document.addEventListener('DOMContentLoaded', () => {
    socket.emit('loadProducts')
})

form.addEventListener('sumbit', (e) => {
    e.preventDefault();
    form.reset();
})

socket.on('update-products', (products) => {
    const productList = document.getElementById('sectionProducts');

    productList.innerHTML = '';

    products.forEach((product) => {
        productList.innerHTML += `
        <div class="card col-4 m-1 productItem" data-id='${product._id}'>
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
                    <button type="button" class="btn btn-danger">eliminar</button>
            </div>
        </div>
        `;
    });

    document.querySelectorAll('.productItem').forEach((button) => {
        button.addEventListener('click', (event) => {
            const productItem = event.target.closest('.productItem');
            const productId = productItem.dataset.id ;

            socket.emit('delete-product', productId);

        })
    })
})