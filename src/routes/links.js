const {Router} = require('express');
const {whatsapp} = require('../lib/whatsapp');
const router = Router();

router.post('/enviarMensaje', async(req, res)=>{
  const tel = '+56973078318'
  const chatId = tel.substring(1) + "@c.us";
  const number_details = await whatsapp.getNumberId(chatId);
  if(number_details){
    const mensaje = "Hola, esto es una prueba de JJdevelopers"
    await whatsapp.sendMessage(chatId, mensaje);
    res.json({res: true})
  }else{
    res.json({res: false})
  }
})

module.exports = router;