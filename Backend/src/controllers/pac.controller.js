import Pac from "../models/Pac";

import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import User from "../models/User";
import Curso from "../models/Curso";
import CursoPac from "../models/CursoPac";
import BasePersonalidad from "../models/BasePersonalidad";
import BasePersonalidadCurso from "../models/BasePersonalidadCurso";
export const createPac = async (req, res, next) => {
  try {
    const { year, type, number, fechaInicio, fechaFin } = req.body;
    // creating a new User
    const pac = new Pac({
      year,
      type,
      number,
      fechaInicio,
      fechaFin,
    });
    // saving the new user
    const savedPac = await pac.save();

    const coordinador = await User.findOne({
      "rol.nombre": { $in: "coordinador" },
    });
    const cursos = await Curso.find();

    cursos.forEach(async (element) => {
      const cursoPac = new CursoPac({
        curso: {
          idCurso: element._id,
          nombre: element.nombre,
          numero: element.numero,
          letra: element.letra,
          nivel: element.nivel,
        },
        pac: {
          idPac: savedPac._id,
          year: savedPac.year,
          type: savedPac.type,
          number: savedPac.number,
          fechaInicio: savedPac.fechaInicio,
          fechaFin: savedPac.fechaFin,
        },
        idDocente: coordinador._id,
      });
      await cursoPac.save();
    });

    req.pacId = savedPac._id;
    next();
    return;
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "error de servidor",
      error: error.message,
    });
  }
};

export const generateBasePersonalidadCurso = async (req, res) => {
  try {
    const basesPersonalidad = await BasePersonalidad.find();
    const cursos = await CursoPac.find({ idPac: req.pacId });
    cursos.forEach(async (curso) => {
      for (let orden = 0; orden < basesPersonalidad.length; orden++) {
        let newBaseCurso = new BasePersonalidadCurso({
          idCursoPac: curso._id,
          orden: orden,
          basepersonalidad: {
            idBase: Types.ObjectId(basesPersonalidad[orden]._id),
            descripcion: basesPersonalidad[orden].descripcion,
          },
        });
        await newBaseCurso.save();
      }
    });
    return res
      .status(200)
      .json({
        message: "periodo academico generado exitosamente",
        id: req.pacId,
      });
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ message: "error!", error: error.message });
  }
};

export const getPacs = async (req, res) => {
  try {
    const pacs = await Pac.find({}).sort({ year: -1, number: -1 });
    if (!pacs)
      return res.status(404).json({ message: "No hay periodos academicos" });
    return res.status(200).json(pacs);
  } catch (error) {
    return res.status(401).json({ message: "error!" });
  }
};
