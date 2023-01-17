import User from "../models/User"
import Rol from "../models/Rol"
import Comuna from "../models/Comuna";
import ResetToken from "../models/ResetToken"
import jwt from "jsonwebtoken"
import config from "../config"
const { body, validationResult } = require('express-validator');


export const signUp = async (req, res) => {//para crear un solo usuario, password manual
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const { nombre,apellidoP,apellidoM, email,emailAp,telefono, rut , password, repeatpassword, rol,comuna } = req.body;
    if(password !== repeatpassword){return res.status(400).json({ message: "password wont match" });}   
    const newUser = new User({
      nombre,
      apellidoP,
      apellidoM,
      email,
      emailAp,
      telefono,
      rut,
      habilitado:true,
      password: await User.encryptPassword(password)
    })
    if (rol) {
      const foundrol = await Rol.findOne({ nombre: { $in: rol } })
      newUser.rol.idRol = foundrol._id
      newUser.rol.nombre = foundrol.nombre
    } else {
      const rol = await Rol.findOne({ nombre: "usuario" })
      newUser.rol.nombre = rol.nombre
      newUser.rol.idRol = rol._id
    }
    if (comuna) {
      const foundcomuna = await Comuna.findOne({ nombre: { $in: comuna } })
      newUser.idComuna = foundcomuna._id    
    }
    const savedUser = await newUser.save()    
    console.log(newUser);
    res.status(200).json({ "message": "usuario creado exitosamente" })
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}

export const signIn = async (req, res) => {
  try {
    const userFound = await User.findOne({ email: req.body.email })

    if (!userFound) return res.status(400).json({ message: "User Not Found" });

    const matchPassword = await User.comparePassword(req.body.password, userFound.password)

    if (!matchPassword)
      return res.status(401).json({
        token: null,
        message: "Invalid Password",
      });
    const timeOut = 1000 * 60 * 60 * 6
    const token = jwt.sign({ id: userFound._id }, config.SECRETO, { expiresIn: timeOut, }); // 6 hours 
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: timeOut
    })
    res.send({ message: 'autenticacion realizada correctamente' })

  } catch (error) {
    console.log(error)
  }
};
export const signOut = async (req, res) => {
  try {
    const token = '';
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(null)
    })
    res.send({ message: 'logout' })

  } catch (error) {
    console.log(error)
  }
};

export const resetPass = async (req, res) => {
  try {
    const { password, repeatpassword, token } = req.body;
    if (password !== repeatpassword) return res.status(400).json({ message: "Passwords dont Match!" });
    const tokenFound = await ResetToken.findOne({ token: token })

    if (!tokenFound) return res.status(400).json({ message: "Invalid token" });
    const id = tokenFound.idUser
    const tokenDate = tokenFound.updatedAt
    var fechaEnMiliseg = Date.now();
    const diffTime = Math.abs(fechaEnMiliseg - tokenDate)
    const diffTimeMinutes = diffTime/(1000*60)
    if (diffTimeMinutes >= 30) return res.status(400).json({ message: "Invalid token, timeout", minutes: diffTimeMinutes, });
    const savedUser = await User.findOneAndUpdate({ _id: id }, { password: await User.encryptPassword(password) }, { upsert: true });
    res.status(200).json({ message: "Cambio de contraseña exitosa" })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

}

export const changePass = async (req, res) => {
  try {
    const { password, repeatpassword} = req.body;
    if (password !== repeatpassword) return res.status(400).json({ message: "Passwords dont Match!" });  
    await User.findOneAndUpdate({ _id : req.userId }, { password: await User.encryptPassword(password) }, { upsert: true });
    res.status(200).json({ message: 'cambio de contraseña realizada correctamente' })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

}