import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/User";
import Rol from "../models/Rol";
import AsignaturaCursoPac from "../models/AsignaturaCursoPac";
import CursoPac from "../models/CursoPac";
import { Types } from "mongoose";

export const verifyToken = async (req, res, next) => {//siempre el paso uno, ya que extrae el token
  let token = req.cookies['jwt'];

  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, config.SECRETO);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });    
    if (!user) return res.status(404).json({ message: "No user found" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export const isDocente = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Rol.find({ _id: { $in: user.rol.idRol } });   
    if (roles[0].nombre === "docente"||roles[0].nombre === "coordinador"||roles[0].nombre === "administrador") {
      req.nivel=roles[0].nombre;
      next();
      return;
    }  
    return res.status(403).json({ message: "No se tiene rol de docente usted es "+roles[0].nombre });
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};
export const isCoordinador = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Rol.findOne({ _id: { $in: user.rol.idRol } });   
    if (roles.nombre === "coordinador" || roles.nombre === "administrador") {
        req.nivel=roles.nombre;
        next();
        return;
    }    

    return res.status(403).json({ message: "Solo coordinadores puede realizar esta accion" + roles.nombre});
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};
export const isAdministrador = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const roles = await Rol.find({ _id: { $in: user.rol.idRol } });

    
      if (roles[0].nombre === "administrador") {
        req.nivel=roles[0].nombre;
        next();
        return;
      }
    

    return res.status(403).json({ message: "Solo administrador puede realizar esta accion usted es "+roles[0].nombre   });
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};

export const accesoAsignatura = async (req, res, next) => {
  try {
    const {acp} = req.body;        
    
    const rol = req.nivel;

    
    if (rol=='docente') {     
     const profesorfound = await AsignaturaCursoPac.find({ _id : Types.ObjectId(acp),idProfesor: Types.ObjectId(req.userId) });
     const asistentefound = await AsignaturaCursoPac.find({ _id : Types.ObjectId(acp),idAsistente: Types.ObjectId(req.userId) });
     if (!profesorfound.length&&!asistentefound.length) {
      const acpfound= await AsignaturaCursoPac.find({ _id : Types.ObjectId(acp)}).populate("idCursoPac");//no es el profesor o asistente de la asignatura? que tal si es el profe jefe del curso'
       if (acpfound.idCursoPac.idDocente==Types.ObjectId(req.userId)) {
        next();
        return;
       }      
      return res.status(403).json({ message: "Como docente usted no tiene acceso a esta asignatura" });
     }
    }
    else if (rol=='coordinador'||rol=='administrador') {
      next();
      return;
    }
    

    return res.status(403).json({ message: "No puede realizar esta accion usted es "+rol   });
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};

export const accesoCurso = async (req, res, next) => {
  try {
    const {idCursoPac} = req.body;        
    
    const rol = req.nivel;

    
    if (rol=='docente') {     
     const profesorfound = await CursoPac.find({ _id : Types.ObjectId(idCursoPac),idDocente: Types.ObjectId(req.userId) });
     
     if (!profesorfound.length) {      
      return res.status(403).json({ message: "Como docente usted no tiene acceso a este curso" });
     }
    }
    else if (rol=='coordinador'||rol=='administrador') {
      next();
      return;
    }   
    return res.status(403).json({ message: "No puede realizar esta accion usted es "+rol   });
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ message: error.message });
  }
};