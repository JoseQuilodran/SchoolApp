const nodemailer = require("nodemailer");

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'correo en comillas'' ',
      pass: 'contraseña de email, en caso de gmail se nesesita verificacion de dos pasos, en '' ',
    },
  });
  transporter.verify().then(()=>{
      console.log('Listo para enviar correos!');
  });