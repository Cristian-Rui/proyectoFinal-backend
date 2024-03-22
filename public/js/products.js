const socket = io();

document.querySelectorAll('.addCartButton').forEach((button) => {
    button.addEventListener('click', async (event) => {
        try {

            const result = await fetch('http://localhost:8080/api/session/getUser', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const response = await result.json();
            const user = response.payload

            const productItem = event.target.closest('.addCartButton');

            const productId = productItem.dataset.id;

            const cartId = user.cart

            socket.emit('addProduct', { cartId: cartId, productId: productId, quantity: 1 })

        } catch (error) {
            console.error(error);
        }
    })
});

socket.on('addedProduct', () => {
    Swal.fire({
        position: "top-end",
        toast: true,
        text: `Producto añadido al carrito`,
        timer: 1500
    });
});

