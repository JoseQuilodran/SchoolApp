import User from "../models/User";
import CursoPac from "../models/CursoPac";
import Asignatura from "../models/Asignatura";
import AsignaturaCursoPac from "../models/AsignaturaCursoPac";
import CursoAlumno from "../models/CursoAlumno";
import AsignaturaAlumno from "../models/AsignaturaAlumno";
import { Types } from "mongoose";


export const createAsignaturaAlumno = async (req, res) => {  
  try {  
    const {acp, idalumno} = req.body;   
    const nuevoAA = new AsignaturaAlumno({
      idAsignaturaCursoPac:acp,
      idAlumno:idalumno
    });  
    const savedAA = await nuevoAA.save();    
    return res.status(200).json(savedAA);    
  } catch (error) {
    return res.status(401).json({ message: "error!" });
}
};
export const getAsignaturaAlumnos = async (req, res) => {
  try {
    const {acp} =req.body
    var alumnosfound
    if(acp){
      alumnosfound= await AsignaturaAlumno.find({idAsignaturaCursoPac:acp}).populate("idAlumno",{password:0}).select('-notas');
    }
    else{
      alumnosfound= await AsignaturaAlumno.find({}).populate("idAlumno",{password:0}).select('-notas');
    }
    if (!alumnosfound) return res.status(404).json({ message: "No hay alumnos en la asignatura!" });
    return res.status(200).json(alumnosfound);
    
  } catch (error) {
    return res.status(401).json({ message: "error!" });
  }
};

export const getNotasAsignatura = async (req, res) => {
  try {
    const {acp} =req.body
    var alumnosfound
    if(acp){
      alumnosfound= await AsignaturaAlumno.find({idAsignaturaCursoPac:acp}).populate("idAlumno",{password:0});
    }
    else{
      alumnosfound= await AsignaturaAlumno.find({}).populate("idAlumno",{password:0});
    }
    if (!alumnosfound) return res.status(404).json({ message: "No hay alumnos en la asignatura!" });
    return res.status(200).json(alumnosfound);
    
  } catch (error) {
    return res.status(401).json({ message: "error!" });
  }
};

export const getAlumnosDisponiblesPac = async (req, res) => {  
  try {
    const {acp} = req.body; 
    const acpfound = await AsignaturaCursoPac.findById(acp);    
    const cursoSel = await CursoPac.findById(acpfound.idCursoPac);
    const CursosPac = await CursoPac.find({idPac:cursoSel.pac.idPac});      
    const AlumnosRegistradosPac = await CursoAlumno.find({idCursoPac:{ $in: CursosPac }}).select('idAlumno -_id');
    let alumnosEnCursoPeriodo = AlumnosRegistradosPac.map(obj => {      
      return obj.idAlumno
    })
    const AlumnosAsignatura =await AsignaturaAlumno.find({idAsignaturaCursoPac:acpfound._id})
    let alumnosEnACP = AlumnosAsignatura.map(obj => {      
      return obj.idAlumno
    })
    const users = await User.find( {'rol.nombre' : 'usuario',_id:{$in:alumnosEnCursoPeriodo, $nin: alumnosEnACP}},{ password: 0 });
    if (!users.length) return res.status(201).json({ message: "No hay alumnos en asignatura" });
    return res.status(200).json(users);    
  } catch (error) {
    return res.status(401).json({ message: "error!" ,error:error});
  }
};
export const deleteAsignaturaAlumno = async (req, res) => {  
  try {
    const {acp,idalumno} = req.body; 
    const eliminado = await AsignaturaAlumno.findOneAndDelete({idAsignaturaCursoPac:acp,idAlumno:idalumno})       
    return res.status(200).json({message:"alumno eliminado de la asignatura correctamente"});    
  } catch (error) {
    return res.status(401).json({ message: "error!" ,error:error});
  }
};

export const updateAsignaturaAlumno = async (req, res) => {
  try {
    const {acp ,notas}= req.body;    

    await Promise.all(notas.map(async (element) => {
      const contents =  await AsignaturaAlumno.findOneAndUpdate({idAsignaturaCursoPac:Types.ObjectId(acp),idAlumno:Types.ObjectId(element._id)},{notas:element.notas})
      console.log(acp);
      console.log(element._id);
      console.log(contents)
    }));
    
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