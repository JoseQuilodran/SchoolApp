import BasePersonalidad from "../models/BasePersonalidad";


export const getBasePersonalidad = async (req, res) => {
  try {
   
    const bases = await BasePersonalidad.find()
    
    
    if (!bases) return res.status(404).json({ message: "No basesPersonalidad found" });
    return res.status(200).json(bases);
    
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!",error:error.message });
  }
};
