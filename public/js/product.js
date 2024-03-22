const socket = io();

const addCartButton = document.querySelector('.addCartButton');
const productQuantity = document.getElementById('productQuantity')


addCartButton.addEventListener('click', async (event) => {
    try {
        const result = await fetch('http://localhost:8080/api/session/getUser', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        

        const response = await result.json();

        const user = response.payload
        
        const productId = event.target.id
        
        const cartId = user.cart

        let quantity = productQuantity.value

        if (!quantity || quantity === 0) {
            quantity = 1;
        }

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