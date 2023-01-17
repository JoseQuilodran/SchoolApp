import { Router } from "express";
const router = Router();

import * as basePersonalidadCtrl from "../controllers/basePersonalidad.controller";
import { authorization, validation } from "../middlewares";


router.get(
  "/getall",
  [
    authorization.verifyToken,    
  ],
  basePersonalidadCtrl.getBasePersonalidad
);

export default router;