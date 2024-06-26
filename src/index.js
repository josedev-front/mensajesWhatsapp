const express = require('express');
const { whatsapp } = require('./lib/whatsapp');
const axios = require('axios');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const puerto = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas
app.use('/api', require('./routes/links'));

// Inicializar WhatsApp y manejar evento de QR
whatsapp.on('qr', (qr) => {
  console.log('QR RECEIVED', qr);
  broadcast(JSON.stringify({ type: 'qr', data: qr }));
});

whatsapp.initialize();

// Servir archivo HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'front.html'));
});

app.post('/enviarMensaje', async (req, res) => {
  try {
    const { telefonos, mensaje } = req.body;

    if (!telefonos || !Array.isArray(telefonos) || telefonos.length === 0) {
      return res.status(400).json({ res: false, error: "Se requiere una lista de números telefónicos válida." });
    }

    if (!mensaje) {
      return res.status(400).json({ res: false, error: "Se requiere un mensaje." });
    }

    let results = [];

    for (let tel of telefonos) {
      const chatId = tel.substring(1) + "@c.us";
      const number_details = await whatsapp.getNumberId(chatId);

      if (number_details) {
        await whatsapp.sendMessage(chatId, mensaje);
        results.push({ tel, status: 'success' });
      } else {
        results.push({ tel, status: 'failed', error: 'Número no válido' });
      }
    }

    res.json({ res: true, results });
  } catch (error) {
    console.error(error);
    broadcast(JSON.stringify({ type: 'error', data: error.message })); // Enviar errores a los clientes
    res.status(500).json({ res: false, error: "Error interno del servidor" });
  }
});

// Función para emitir mensajes a todos los clientes conectados
const broadcast = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send(JSON.stringify({ type: 'message', data: 'Welcome to the WebSocket server' }));

  // Override console.log to send messages to clients
  const originalLog = console.log;
  console.log = function (message) {
    originalLog.apply(console, arguments);
    broadcast(JSON.stringify({ type: 'log', data: message }));
  };
});

server.listen(puerto, () => {
  console.log(`Server on port ${puerto}`);
});
