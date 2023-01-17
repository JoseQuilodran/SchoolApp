import { Router } from "express";
const router = Router();

import * as usersCtrl from "../controllers/user.controller";
import { authorization, validation } from "../middlewares";

router.post(
  "/",
  [
    authorization.verifyToken,
    authorization.isAdministrador,
    validation.checkDuplicateUsernameOrEmail,
  ],
  usersCtrl.createUser
);

router.get(
  "/",
  [
    authorization.verifyToken,    
  ],
  usersCtrl.getUserCurrent
);
router.get(
  "/getusers",
  [
    authorization.verifyToken,    
  ],
  usersCtrl.getUsers
);
router.post(
  "/getusersrol",
  [
    authorization.verifyToken, 
    authorization.isCoordinador,      
  ],
  usersCtrl.getUsers
);
router.post(
  "/updateusers",
  [
    authorization.verifyToken,    
    authorization.isCoordinador,    
  ],
  usersCtrl.updateUsers
);
export default router;