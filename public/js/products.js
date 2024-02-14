const socket = io();

document.addEventListener('DOMContentLoaded', async () => {
    if (!localStorage.getItem('cartId')) {
        socket.emit('newCart')
    }

});

socket.on('newCart', data => {
    const jsonId = JSON.stringify(data._id);
    localStorage.setItem('cartId', jsonId);
})


document.querySelectorAll('.addCartButton').forEach((button) => {
    button.addEventListener('click', async (event) => {
        try {
            const productItem = event.target.closest('.addCartButton');
            
            const productId = productItem.dataset.id;
            
            const cartId = JSON.parse(localStorage.getItem('cartId'))

            socket.emit('addProduct', { cartId: cartId, productId: productId })

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

