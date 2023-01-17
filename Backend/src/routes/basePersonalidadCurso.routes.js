import { Router } from "express";
const router = Router();

import * as basePersonalidadCursoCtrl from "../controllers/basePersonalidadcurso.controller";
import { authorization, validation } from "../middlewares";


router.post(
  "/getall",
  [
    authorization.verifyToken,    
  ],
  basePersonalidadCursoCtrl.getBasePersonalidadCurso
);

router.post(
  "/getalumno",
  [
    authorization.verifyToken,    
  ],
  basePersonalidadCursoCtrl.getPersonalidadAlumnoCurso
);

export default router;