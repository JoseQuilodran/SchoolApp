import { Router } from "express";
const router = Router();

import * as pacsCtrl from "../controllers/pac.controller";
import { authorization, validation } from "../middlewares";

router.post(
  "/",
  [
    authorization.verifyToken,
    authorization.isAdministrador,
    pacsCtrl.createPac,
  ],
  pacsCtrl.generateBasePersonalidadCurso
);

router.get(
  "/getall",
  [
    authorization.verifyToken,    
  ],
  pacsCtrl.getPacs
);

export default router;