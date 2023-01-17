import User from "../models/User";
import Rol from "../models/Rol";
import Comuna from "../models/Comuna";
import config from "../config";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const createUser = async (req, res) => {//para crear un solo usuario, password automatica
    try {
    const { nombre, email,emailAp, password, roles ,comuna} = req.body;

    const rolesFound = await Rol.findOne({ nombre: { $in: roles } });
    const comunaFound = await Comuna.findOne({ nombre: { $in: comuna } });

    // creating a new User
    const user = new User({
      nombre,
      email,
      emailAp,
      password,
      roles: rolesFound,
      comuna: comunaFound,
      habilitado:true,
    });

    // encrypting password
    user.password = await User.encryptPassword(user.password);

    // saving the new user
    const savedUser = await user.save();

    return res.status(200).json({
      _id: savedUser._id,
      nombre: savedUser.nombre,
      email: savedUser.email,
      emailAp: savedUser.emailAp,
      rol: savedUser.rol,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getUsers = async (req, res) => {
  try {
    const { rol} = req.body;    
    var users;
    if(rol){      
      const rolBuscar = await Rol.find({nombre:rol});  
      users = await User.find( {'rol.nombre' : rol,habilitado:true},{ password: 0 })
    }
    else{
      users = await User.find( {},{ password: 0 }).populate("idComuna");
    }
    if (!users) return res.status(404).json({ message: "No users found" });
    return res.status(200).json(users);
    
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!",error:error });
  }
};

export const updateUsers = async (req, res) => {
  try {
    const users = req.body;    
    users.forEach(element => {      
      Rol.findOne({nombre:element.rol}).exec().then((result) => {        
        User.findOneAndUpdate({ _id : Types.ObjectId(element._id) }, { nombre:element.nombre,apellidoP:element.apellidoP,apellidoM:element.apellidoM, email:element.email, emailAp: element.emailAp, rut:element.rut, telefono:element.telefono,idComuna:element.comuna._id,
          rol:{idRol:result._id,nombre:result.nombre}}).exec()
      })       
    });
    return res.status(200).json({
      message: "actualizacion de usuarios exitosa"
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "actualizacion de usarios erronea"
    });
  }
};

export const getUserCurrent = async (req, res) => {  
  try { 
    const user = await User.findById(req.userId, { password: 0 }).populate("idComuna");
    if (!user) return res.status(404).json({ message: "No user found" });
    return res.status(200).json({
      nombre: user.nombre,
      apellidoP: user.apellidoP,
      apellidoM: user.apellidoM,      
      email: user.email,
      emailAp: user.emailAp,
      telefono: user.telefono,
      rol: {idRol:user.rol.idRol,nombre:user.rol.nombre},
      idComuna: user.idComuna,
      rut: user.rut,
      habilitado:user.habilitado,    
    });
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
 
};