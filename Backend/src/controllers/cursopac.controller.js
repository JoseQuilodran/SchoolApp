import User from "../models/User";
import Rol from "../models/Rol";
import Curso from "../models/Curso";
import CursoPac from "../models/CursoPac";
import config from "../config";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import Pac from "../models/Pac";
import AsignaturaCursoPac from "../models/AsignaturaCursoPac";

export const createCursoPac= async (req, res) => {
  try {
    const { cursoID,pacID,profesorjefeID } = req.body;
   
    
    const userfound = await User.findOne({ _id: { $in: Types.ObjectId(profesorjefeID) } },{ password: 0 });  
    
    // creating a new CursoPac
    const cursoPac = new CursoPac({     
      
      profesorjefeID:userfound,   
    })
    if (cursoID) {
      const foundcurso = await Curso.findOne({ _id: { $in: Types.ObjectId(cursoID) } })
      cursoPac.curso = foundcurso
     
    }
    if (pacID) {
      const foundpac = await Pac.findOne({ _id: { $in: Types.ObjectId(pacID) } });
      cursoPac.pac=foundpac
     
    }
    const savedCursoPac = await cursoPac.save();

    return res.status(200).json({
      _id: savedCursoPac._id,
      curso: savedCursoPac.curso,
      pac : savedCursoPac.pac,
      profesorjefeID:savedCursoPac.profesorjefeID,     
    });
  } catch (error) {
    console.error(error);
  }
};

export const createCursoPacAll= async (req, res) => {
  try {
    const {idPac} = req.body; 
    const foundpac = await Pac.findOne({ _id: { $in: Types.ObjectId(idPac) } });
    const coordinador = await User.findOne({ "rol.nombre": { $in: "coordinador" } });
    const cursos = await Curso.find();
    cursos.forEach(element => {
       const cursoPac = new CursoPac({     
        curso:{
          idCurso:element._id,
          nombre:element.nombre,
          numero:element.numero,
          letra:element.letra,
          nivel:element.nivel
        },
        pac:{
          idPac:foundpac._id,
          year:foundpac.year,
          type:foundpac.type,
          number:foundpac.number
        },
        idDocente:coordinador._id
       })
       cursoPac.save();
    });   
     

    return res.status(200).json({
      message:"cursos del periodo academico generados"    
    });
  } catch (error) {
    console.error(error);
  }
};

export const getCursoPacs = async (req, res) => {
  try {
    const {idpac} = req.body; 
    var cursopacs
    if(idpac){
      cursopacs = await CursoPac.find({'pac.idPac':idpac}).sort({ _id: -1 });;
    }
    cursopacs = await CursoPac.find({}).populate("idDocente",{password:0}).sort({ _id: -1 });;
    if (!cursopacs) return res.status(404).json({ message: "No hay cursos registrados" });
    return res.status(200).json(cursopacs);
    
  } catch (error) {
    return res.status(401).json({ message: "error!",error:error });
  }
};


export const updateCursoPacs = async (req, res) => {
  try {
    const {iddocente,idcursopac} = req.body;    
     
    const cursopacs = await CursoPac.findOneAndUpdate({ _id : Types.ObjectId(idcursopac) }, {idDocente: Types.ObjectId(iddocente)})
    
    return res.status(200).json({
      message: "actualizacion de curso-periodo academico exitosa"
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "actualizacion de curso-periodo academico erronea"
    });
  }
};

export const getCursoPacsDisponibles = async (req, res) => {
  try {
    const {acp} = req.body;     
    const rol = req.nivel;
    const user = req.userId;

    if (rol=='docente') {     
      const profesorJefeFound = await CursoPac.find({idDocente: Types.ObjectId(user)});
      let mapJefe = profesorJefeFound.map(obj => {      
        return obj._id
      })
      const profesorfound = await AsignaturaCursoPac.find({ idProfesor: Types.ObjectId(req.userId) });
      let mapProfesor = profesorfound.map(obj => {      
        return obj.idCursoPac
      })
      const asistentefound = await AsignaturaCursoPac.find({ idAsistente: Types.ObjectId(req.userId) });
      let mapAsistente = asistentefound.map(obj => {      
        return obj.idCursoPac
      })     
      
      const cursosDisponibles = await CursoPac.find( {$or: [ {_id:{ $in: mapJefe}},{_id:{ $in: mapProfesor}},{_id:{ $in: mapAsistente}}]}).populate("idDocente",{password:0}).sort({ _id: -1 });
      if (!cursosDisponibles) return res.status(404).json({ message: "No tiene acceso a ningun curso!" });
      return res.status(200).json(cursosDisponibles);

     }
     else if (rol=='coordinador'||rol=='administrador') {
      const cursopacs = await CursoPac.find({}).populate("idDocente",{password:0}).sort({ _id: -1 });
      if (!cursopacs) return res.status(404).json({ message: "No hay cursos registrados" });
      return res.status(200).json(cursopacs);
     }

  
    
  } catch (error) {
    return res.status(401).json({ message: "error!",error:error.message });
  }
};
