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

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/public/Registro-Cod-Mobile.html');
      });
});


// ========> Envío los datos al servidor <=========
/*const xhr = new XMLHttpRequest();
xhr.open('POST', '/enviar', true);
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    alert(xhr.responseText);
    formulario.reset();
  }
};
xhr.send(formData);
});*/