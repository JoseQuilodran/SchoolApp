import Comuna from "../models/Comuna";



export const getall = async (req, res) => {
  try {
    const comunas = await Comuna.find({});
    if (!comunas) return res.status(404).json({ message: "No hay comunas" });
    return res.status(200).json(comunas);
    
  } catch (error) {
    return res.status(401).json({ message: "error!" });
  }
};

