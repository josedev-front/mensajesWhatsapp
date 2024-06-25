const { Router } = require('express');
const { whatsapp } = require('../lib/whatsapp');
const router = Router();

router.post('/enviarMensaje', async (req, res) => {
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
    res.status(500).json({ res: false, error: "Error interno del servidor" });
  }
});

module.exports = router;
