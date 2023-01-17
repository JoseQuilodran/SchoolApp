import BasePersonalidadCurso from "../models/BasePersonalidadCurso";
import CursoAlumno from "../models/CursoAlumno";

export const getBasePersonalidadCurso = async (req, res) => {
  try {
    const { idcursopac } = req.body;
    const bases = await BasePersonalidadCurso.find({idCursoPac:idcursopac});
    
    
    if (!bases) return res.status(404).json({ message: "No basesPersonalidadCurso found" });

    let rer = bases.map((obj) => {
      var json =[obj.orden , obj.basepersonalidad.descripcion]
      return json ;
    });
    
    return res.status(200).json(rer);

    
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!",error:error.message });
  }
};

export const getPersonalidadAlumnoCurso = async (req, res) => {
  try {
    const { idcursopac, idalumno } = req.body;
    if(!idalumno){
      return res.status(404).json({ message: "Falta alumno" });
    }
    const bases = await BasePersonalidadCurso.find({idCursoPac:idcursopac}).sort({ orden : 'asc'});
    const cursoAlumno = await CursoAlumno.find({idCursoPac: idcursopac, idAlumno:idalumno}).populate("idAlumno", { password: 0 });
    
    if (!bases) return res.status(404).json({ message: "No basesPersonalidadCurso found" });
    if (!cursoAlumno) return res.status(404).json({ message: "No se encuentra alumno" });
    const estados = cursoAlumno[0].estadoPersonalidad;
    let rer = bases.map((obj) => {
      var json =[obj.orden , obj.basepersonalidad.descripcion , estados[obj.orden]]
      return json ;
    });
    
    return res.status(200).json(rer);

    
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!",error:error.message });
  }
};
