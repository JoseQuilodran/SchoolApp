import User from "../models/User";
import CursoPac from "../models/CursoPac";
import Asignatura from "../models/Asignatura";
import AsignaturaCursoPac from "../models/AsignaturaCursoPac";
import CursoAlumno from "../models/CursoAlumno";
import AsignaturaAlumno from "../models/AsignaturaAlumno";
import { Types } from "mongoose";


export const createAsignaturaCursoPac= async (req, res) => {
  try {
    const { idcursopac,idasignatura,idprofesor,idasistente } = req.body;
    
    const cursopacfound = await CursoPac.findOne({ _id: { $in: Types.ObjectId(idcursopac) } });
    const profesorfound = await User.findOne({ _id: { $in: Types.ObjectId(idprofesor) } },{ password: 0 });  
    
    const asignaturafound = await Asignatura.findOne({ _id: { $in: Types.ObjectId(idasignatura) } });
    
    // creating a new CursoPac
    if(!cursopacfound||!profesorfound||!asignaturafound){
      return res.status(404).json({
        message: "error en parametro"  
      });
    }
    const acp= new AsignaturaCursoPac({    
      idCursoPac:cursopacfound._id,
      idProfesor:profesorfound._id,     
      asignatura:{
        idAsignatura:asignaturafound._id,
        codigo:asignaturafound.codigo,
        nombre:asignaturafound.nombre,
      },
    }) 
    if(idasistente){
      const asistentefound = await User.findOne({ _id: { $in: Types.ObjectId(idasistente) } },{ password: 0 });  
      acp.idAsistente=asistentefound._id
    }
    const savedACP = await acp.save();  
    //asignacion asignatura a almonos actuales curso
    const cursoAlumno = await CursoAlumno.find({idCursoPac:idcursopac})
    
    cursoAlumno.forEach(async element => {   
      let aa= new AsignaturaAlumno({    
        idAsignaturaCursoPac:savedACP._id,
        idAlumno:element.idAlumno,        
      }) 
      const aasaved = await aa.save();      
    });

    return res.status(200).json({
      _id: savedACP._id,    
    });
  } catch (error) {
    console.error(error);
  }
};

export const getAsignaturaCursoPacs = async (req, res) => {
  try {
    const {idcursopac} =req.body;
    var acps
    if(idcursopac){
      acps = await AsignaturaCursoPac.find({idCursoPac:idcursopac}).populate("idProfesor",{password:0}).populate("idAsistente",{password:0})
    }
    else{
      acps = await AsignaturaCursoPac.find( {}).populate("idProfesor",{password:0}).populate("idAsistente",{password:0}).populate("idCursoPac");
    }
    if (!acps) return res.status(404).json({ message: "No hay asignaturas registradas!" });
    return res.status(200).json(acps);
    
  } catch (error) {
    return res.status(401).json({ message: "error!" });
  }
};
export const getAsignaturasDisponibles = async (req, res) => {
  try {
    const {idcursopac} = req.body;    
    const cursopacfound = await CursoPac.findById(Types.ObjectId(idcursopac));    
    const acpfound = await AsignaturaCursoPac.find( {idCursoPac:cursopacfound._id})
    let rer = acpfound.map(obj => {      
      return obj.asignatura.idAsignatura
    })
    console.log(rer);
    const asignaturasfound = await Asignatura.find( {_id:{ $nin: rer}});
    console.log(asignaturasfound);
    if (!asignaturasfound) return res.status(404).json({ message: "No hay asignaturas disponibles!" });
    return res.status(200).json(asignaturasfound);
    
  } catch (error) {
    return res.status(401).json({ message: "error!",error:error });
  }
};

export const updateAsignaturaCursoPacs = async (req, res) => {
  try {
    const {idacp,idprofesor,idasistente} = req.body;    
    if(!idasistente){    
      await AsignaturaCursoPac.findOneAndUpdate({ _id : Types.ObjectId(idacp) }, {idProfesor:Types.ObjectId(idprofesor)})
    }
    else{
      await AsignaturaCursoPac.findOneAndUpdate({ _id : Types.ObjectId(idacp) }, {idProfesor:Types.ObjectId(idprofesor),idAsistente:Types.ObjectId(idasistente)})
    }
    return res.status(200).json({
      message: "actualizacion de asignatura curso-periodo academico exitosa"
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "actualizacion de asignatura curso-periodo academico erronea"
    });
  }
};

export const updateEsquema = async (req, res) => {
  try {
    const {idacp, esquemanotas} = req.body;    
      
    await AsignaturaCursoPac.findOneAndUpdate({ _id : Types.ObjectId(idacp) }, {esquemaNotas:esquemanotas})
    
    return res.status(200).json({message: "actualizacion de esquema de notas exitosa"});
    
  } catch (error) {
    return res.status(401).json({ message: "error!",error:error });
  }
};

export const getEsquema = async (req, res) => {
  try{
  const {idacp} =req.body;
    var acpfound
    if(idacp){
      acpfound = await AsignaturaCursoPac.find({ _id : Types.ObjectId(idacp) }).select('esquemaNotas');
    }
    else{
      return res.status(401).json({ message: "error!, no se entrego id" });
    }
    if (!acpfound) return res.status(404).json({ message: "No hay asignatura con ese id" });
    return res.status(200).json(acpfound);
    
  } catch (error) {
    return res.status(401).json({ message: "error!" });
  }
};
export const deleteNota = async (req, res) => {
  try{
  const {idacp,nota} =req.body;
    var acpfound
    if(idacp){
      
      acpfound = await AsignaturaCursoPac.find({ _id : Types.ObjectId(idacp) }).select('esquemaNotas');
      
      let clone=[].concat(acpfound[0].esquemaNotas);         
      clone.splice(nota,2); 
      clone.push(0,0);
      
      await AsignaturaCursoPac.findOneAndUpdate({ _id : Types.ObjectId(idacp) }, {esquemaNotas:clone})
      
      const AlumnosAsignatura =await AsignaturaAlumno.find({idAsignaturaCursoPac: Types.ObjectId(idacp)})
      
      AlumnosAsignatura.forEach(async element => {        
        let notaClone=[].concat(element.notas);      
        notaClone.splice(nota,1);
        notaClone.push(0);
        console.log(notaClone);
        await AsignaturaAlumno.findOneAndUpdate({ _id : Types.ObjectId(element._id) }, {notas:notaClone}).exec()
     });      
    }
    else{
      return res.status(401).json({ message: "error!, no se entrego id" });
    }
    if (!acpfound) return res.status(404).json({ message: "No hay asignatura con ese id" });
    return res.status(200).json(acpfound);
    
  } catch (error) {
    return res.status(401).json({ message: "error!" });
  }
};