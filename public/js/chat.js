const socket = io();
let user;

window.addEventListener('DOMContentLoaded',async (e) => {
    const result = await fetch('http://localhost:8080/api/session/getUser', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const response = await result.json();

    user = response.payload

    socket.emit('newUser', user.email);
})


const inputData = document.getElementById('inputData');

inputData.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        if (!!inputData.value.trim()) {
            socket.emit('message', { user: user.email, message: inputData.value.trim() })

        }
        inputData.value = '';
    }
});

socket.on('allMessages', data => {
    let messages = document.getElementById('outputData');
    messages.innerHTML = '';
    data.forEach(message => {
        messages.innerHTML += `
        <div class="card w-50 m-4">
        <div class="card-header">
            ${message.user}
        </div>
        <div class="card-body">
            <p class="card-text">${message.message}</p>
        </div>
    </div>
        `
    });
});

socket.on('notification', user => {
    Swal.fire({
        position: "top-end",
        toast: true,
        text: `el usuario ${user} se ha conectado`,
        timer: 1500
    });
})