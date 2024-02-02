const socket = io();

let user;

//Alert para identificacion
Swal.fire({
    title: "Bienvenida/o al chat en vivo",
    input: "email",
    inputLabel: "Ingrese su dirección de correo electrónico",
    inputPlaceholder: "ejemplo@algo.com"
}).then(data => {
    user = data.value;
    socket.emit('newUser', user);
});


const inputData = document.getElementById('inputData') ;

inputData.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        if (!!inputData.value.trim()) {
            socket.emit('message', { user: user, message: inputData.value.trim() })

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