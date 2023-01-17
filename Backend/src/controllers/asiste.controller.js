import User from "../models/User";

import AsignaturaCursoPac from "../models/AsignaturaCursoPac";
import config from "../config";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import Asiste from "../models/Asiste";
import CursoPac from "../models/CursoPac";

const getSemana = (fechaBuscar)=>{
  var oneJan = new Date(fechaBuscar.getFullYear(), 0, 1);
  var numberOfDays = Math.floor(
    (fechaBuscar - oneJan) / (24 * 60 * 60 * 1000)
  );
  var nSemanaBuscar = Math.ceil((fechaBuscar.getDay() + 1 + numberOfDays) / 7);//calculo numero semana en el año, se le suma 1 por contar la primera semana del año aunque este cortada
  if (nSemanaBuscar==53) {
    nSemanaBuscar=1;
  } 
  return nSemanaBuscar
}

export const getAsisteSemana = async (req, res) => {
    try {
    const {idCursoPac,fecha} = req.body;
    const cursoPacFound = await CursoPac.findOne({_id:Types.ObjectId(idCursoPac)});
    if (!cursoPacFound) {
      return res.status(404).json({ message: "Curso no existe!" });
    }
    var inicioPac= getSemana( cursoPacFound.pac.fechaInicio);
    var finPac=getSemana( cursoPacFound.pac.fechaFin);
    console.log(inicioPac+'   '+finPac);

    var fechaBuscar;
    if (fecha) {
      fechaBuscar = new Date(fecha);
    }
    else{
      fechaBuscar = new Date();      
    }
    var lunesInicio = fechaBuscar.getDate() - fechaBuscar.getDay() +1; //domingo+1
    fechaBuscar.setDate(lunesInicio); //primer lunes de la semana del dia buscado *Importante*
   
    var nSemanaBuscar= getSemana(fechaBuscar)+1;//quickFix
    console.log(nSemanaBuscar);
    if (fechaBuscar>cursoPacFound.pac.fechaFin) {
      nSemanaBuscar=finPac
    }else if(fechaBuscar<cursoPacFound.pac.fechaInicio){
      nSemanaBuscar=inicioPac
    }

    var asistefound= await Asiste.find({idAsignaturaCursoPac:idCursoPac,numeroSemana:nSemanaBuscar}).populate("idAlumno",{password:0});
    if (!asistefound) return res.status(404).json({ message: "No hay registros de asistencia con este criterio!" });
    return res.status(200).json(asistefound);
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllAsiste = async (req, res) => {
  try {
    const asiste = await Asiste.find( {}).populate("alumno",{password:0}).populate("acp");
    if (!asiste) return res.status(404).json({ message: "No resgistro de alumno a asignatura" });
    return res.status(200).json(asiste);
    
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!",error:error });
  }
};

export const updateAsiste = async (req, res) => {
  try {
    const {idCursoPac,asistencia,fecha}= req.body;    

    await Promise.all(asistencia.map(async (element) => {
      const contents =  await Asiste.findOneAndUpdate({idCursoPac:Types.ObjectId(idCursoPac),fechaSemana:fecha,idAlumno:Types.ObjectId(element._id)},{estadoSemana:element.semana})
      
    }));
    
    return res.status(200).json({
      message: "actualizacion de asistencia exitosa"
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "actualizacion de usarios erronea",
      error:error.message
    });
  }
};