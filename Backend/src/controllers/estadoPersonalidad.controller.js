import EstadoPersonalidad from "../models/EstadoPersonalidad";


export const getEstados = async (req, res) => {
  try {
   
    const estados = await EstadoPersonalidad.find({});    
    if (!estados) return res.status(404).json({ message: "No estadosPersonalidad found" });
    let estadosString = [];
    estados.forEach( element => {    
      let x = {value:element.codigo,label:element.descripcion}    ;
    estadosString.push(x);
  });
   
    return res.status(200).json(estadosString);
    
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!",error:error.message });
  }
};

