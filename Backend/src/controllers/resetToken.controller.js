import User from "../models/User";
import ResetToken from "../models/ResetToken";
import { transporter } from "../mailer";
import Randomstring from "randomstring";
import colegio from "../colegio";

export const createResetToken = async (req, res) => {
  try {
    const userFound = await User.findOne({ email: req.body.email }, { password: 0 })
    if (!userFound) return res.status(400).json({ message: "User Not Found" });
    const newToken = Randomstring.generate()

    const savedToken = await ResetToken.findOneAndUpdate({ idUser: userFound._id }, { token: newToken },{upsert: true});
   
    await transporter.sendMail({
      from: '"Recuperacion Cuenta Intranet CDSCC" <ssfarmacia1@gmail.com>', // sender address
      to: req.body.email, // list of receivers
      subject: "Recuperacion cuenta Intranet "+colegio.NOMBRECOLEGIO.toLowerCase, // Subject line
      text: "", // plain text body
      html: `<b>Correo de recuperacion de cuenta Intranet </b>
      <a href="http://localhost:8080/resetpass/${newToken}">Ingrese aqui para crear una nueva contraseña</a>
      <p>dispone de 30 minutos para usar este enlace</p> `, // html body
    });

    return res.status(200).json({
      message:"Token generado correctamente"
    });
  } catch (error) {
    console.error(error);
  }
};


