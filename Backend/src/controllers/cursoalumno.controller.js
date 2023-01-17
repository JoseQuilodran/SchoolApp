import Curso from "../models/Curso";
import AsignaturaCursoPac from "../models/AsignaturaCursoPac";
import CursoAlumno from "../models/CursoAlumno";
import AsignaturaAlumno from "../models/AsignaturaAlumno";
import CursoPac from "../models/CursoPac";
import User from "../models/User";
import { Types } from "mongoose";
import Asiste from "../models/Asiste";

export const createCursoAlumno = async (req, res) => {
  try {
    const { idcursopac, idalumno } = req.body;
    const nuevoCA = new CursoAlumno({
      idCursoPac: idcursopac,
      idAlumno: idalumno,
    });
    const savedCursoAlumno = await nuevoCA.save();
    const aaCursoPac = await AsignaturaCursoPac.find({
      idCursoPac: idcursopac,
    }); //asignacion de asignaturas al alumno
    aaCursoPac.forEach((element) => {
      const nuevoAA = new AsignaturaAlumno({
        idAsignaturaCursoPac: element._id,
        idAlumno: idalumno,
      });
      nuevoAA.save();
    });
    const cursoYear = await CursoPac.find({
      _id: Types.ObjectId(idcursopac),
    }).select("pac.fechaInicio , pac.fechaFin");
    const inicioPeriodo = new Date(cursoYear[0].pac.fechaInicio);
    const finPeriodo = new Date(cursoYear[0].pac.fechaFin);
    var lunesInicio = inicioPeriodo.getDate() - inicioPeriodo.getDay() ; //domingo+1
    inicioPeriodo.setDate(lunesInicio); //primer lunes de la semana del periodo *Importante*
    var lunesFin = finPeriodo.getDate() - finPeriodo.getDay() + 1; //domingo+1
    finPeriodo.setDate(lunesFin); //primer lunes de la semana del Fin *Importante*
    var diferencia =( finPeriodo - inicioPeriodo) / (1000 * 60 * 60 * 24) / 7;//diferencia en semanas , ya que comienza en lunes , son multiplos de 7   

    var oneJan = new Date(inicioPeriodo.getFullYear(), 0, 1);
    var numberOfDays = Math.floor(
      (inicioPeriodo- oneJan) / (24 * 60 * 60 * 1000)
    );
    var nPrimeraSemana = Math.ceil((inicioPeriodo.getDay() + 1 + numberOfDays) / 7)+1;//calculo numero semana en el año, se le suma 1 por contar la primera semana del año aunque este cortada
   if (nPrimeraSemana==53) {
     nPrimeraSemana=1;
   }
    var nUltimaSemana= nPrimeraSemana+diferencia; // calculo simple del nuero de semana del fin del periodo
    
    var iso;
    for (nPrimeraSemana; nPrimeraSemana <= nUltimaSemana; nPrimeraSemana++) {
      iso = inicioPeriodo.toISOString();      
      const nuevoAsiste = new Asiste({
        idCursoPac: idcursopac,
        idAlumno: idalumno,
        fechaSemana: iso,
        numeroSemana: nPrimeraSemana,
      });
      await nuevoAsiste.save();
      inicioPeriodo.setDate(inicioPeriodo.getDate() + 7);
    }
    return res.status(200).json(savedCursoAlumno);
  } catch (error) {
    return res.status(401).json({ message: "error!", error: error.message });
  }
};
export const getAlumnosCursoPac = async (req, res) => {
  try {
    const { idcursopac } = req.body;    

    const cursoAlumno = await CursoAlumno.find({
      idCursoPac: idcursopac,
    }).populate("idAlumno", { password: 0 });
    if (cursoAlumno.length == 0)
      return res.status(201).json({ message: "No hay alumnos en curso" });
    return res.status(200).json(cursoAlumno);
  } catch (error) {
    return res.status(401).json({ message: "error!" });
  }
};

export const getAlumnosDisponiblesPac = async (req, res) => {
  try {
    const { idcursopac } = req.body;
    const cursoSel = await CursoPac.findById(idcursopac);
    const CursosPac = await CursoPac.find({ idPac: cursoSel.pac.idPac });
    const AlumnosRegistradosPac = await CursoAlumno.find({
      idCursoPac: { $in: CursosPac },
    }).select("idAlumno -_id");
    let rer = AlumnosRegistradosPac.map((obj) => {
      return obj.idAlumno;
    });
    const users = await User.find(
      { "rol.nombre": "usuario", _id: { $nin: rer } },
      { password: 0 }
    );
    if (!users.length)
      return res.status(201).json({ message: "No hay alumnos en curso" });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(401).json({ message: "error!", error: error });
  }
};

export const deleteCursoAlumno = async (req, res) => {
  try {
    const { idcursopac, idalumno } = req.body;
    const eliminado = await CursoAlumno.findOneAndDelete({
      idCursoPac: idcursopac,
      idAlumno: idalumno,
    });
    return res
      .status(200)
      .json({ message: "alumno eliminado del curso correctamente" });
  } catch (error) {
    return res.status(401).json({ message: "error!", error: error });
  }
};

export const getListadoAlumnosCursoPac = async (req, res) => {
  try {
    const { idcursopac } = req.body;    

    const cursoAlumno = await CursoAlumno.find({
      idCursoPac: idcursopac,
    }).populate("idAlumno", { password: 0 });
    if (cursoAlumno.length == 0){
      return res.status(201).json({ message: "No hay alumnos en curso" });}
    let rer = cursoAlumno.map((obj) => {
      return obj.idAlumno;
    });
    return res.status(200).json(rer);
  } catch (error) {
    return res.status(401).json({ message: "error!",error:error.message });
  }
};

export const updatePersonalidadAlumno = async (req, res) => {
  try {
    const { idcursopac,idalumno,estados } = req.body;    

    const cursoAlumno = await CursoAlumno.findOneAndUpdate({idCursoPac: idcursopac,idAlumno:idalumno,}, { estadoPersonalidad:estados }).exec()   
        
    return res.status(200).json('Actualisacion de personalidad alumnos actualizada exitosamente');
  } catch (error) {
    return res.status(401).json({ message: "error!",error:error.message });
  }
};

export const getPeriodosAlumno = async (req, res) => {
  try {
    const alumno= req.userId;
    const found = await CursoAlumno.find({idAlumno: alumno}).populate("idCursoPac");
    if (found.length==0) {
      return res.status(401).json({ message: "no hay registros de cursos para el usuario"});
    }
    
    let rer = found.map((obj) => {
      return obj.idCursoPac.pac;
    });
    return res
      .status(200)
      .json(rer);
  } catch (error) {
    return res.status(401).json({ message: "error!", error: error.message });
  }
};