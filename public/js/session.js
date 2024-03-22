const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', async (e) => {
    try {
        const result = await fetch('http://localhost:8080/api/session/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (result.ok) {
            window.location.href = '/login';
        } else {
            console.error('Error al cerrar sesión:', result.status);
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }

});