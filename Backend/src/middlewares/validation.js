import User from "../models/User";
import { roles } from "../models/Rol";

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    
    const email = await User.findOne({ email: req.body.email });
    if (email)
      return res.status(400).json({ message: "The email already exists" });
    next();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const checkrolesExisted = (req, res, next) => {
  if (req.body.roles) {
    
      if (!roles.includes(req.body.roles) && req.body.roles!=="") {
        return res.status(400).json({
          message: `rol ${req.body.roles} does not exist`,
        });
      }
    
  }

  next();
};

export { checkDuplicateUsernameOrEmail, checkrolesExisted };