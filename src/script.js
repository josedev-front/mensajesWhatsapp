document.getElementById('mensajeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const telefonos = document.getElementById('telefonos').value.split(',').map(tel => tel.trim());
    const mensaje = document.getElementById('mensaje').value;

    const data = {
        telefonos: telefonos,
        mensaje: mensaje
    };

    fetch('http://localhost:3000/api/enviarMensaje', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Mensaje enviado con éxito');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error al enviar el mensaje');
    });
});
