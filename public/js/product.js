const socket = io();

const addCartButton = document.querySelector('.addCartButton');
const productQuantity = document.getElementById('productQuantity')

addCartButton.addEventListener('click', async (event) => {
    try {
        console.log('click')

        const productId = event.currentTarget.id;

        const cartId = JSON.parse(localStorage.getItem('cartId'))

        let quantity = productQuantity.value

        if (!quantity || quantity === 0) {
            quantity = 1;
        }
        console.log(quantity)

        socket.emit('addProduct', { cartId: cartId, productId: productId, quantity: quantity })

    } catch (error) {
        console.error(error);
    }
});

socket.on('addedProduct', () => {
    Swal.fire({
        position: "top-end",
        toast: true,
        text: `Producto añadido al carrito`,
        timer: 1500
    });
});