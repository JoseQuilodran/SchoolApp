import Asignatura from "../models/Asignatura";
import { Types } from "mongoose";
export const createAsignatura = async (req, res) => {
  try {
    const { nombre, codigo } = req.body;

    const asignatura = new Asignatura({
      nombre,
      codigo,
    });

    const savedAsignatura = await asignatura.save();

    return res.status(200).json({
      _id: savedAsignatura._id,
      nombre: savedAsignatura.nombre,
      codigo: savedAsignatura.codigo,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "error de servidor",
      error: error
    });
  }
};

export const getAsignaturas = async (req, res) => {
  try {
    const asignaturas = await Asignatura.find({});
    if (!asignaturas) return res.status(404).json({ message: "No hay asignaturas" });
    return res.status(200).json(asignaturas);

  } catch (error) {
    return res.status(401).json({ message: "error!" });
  }
};

export const updateAsignaturas = async (req, res) => {
  try {
    const asignaturas = req.body;    
    asignaturas.forEach(element => {   
        Asignatura.findOneAndUpdate({ _id : Types.ObjectId(element._id) }, { nombre:element.nombre,codigo:element.codigo }).exec()   
    });
    return res.status(200).json({
      message: "actualizacion de asignaturas exitosa"
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "actualizacion de asignaturas erronea",
      error:error,
    });
  }
};