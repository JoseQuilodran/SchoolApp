import { Router } from "express";
const router = Router();

import * as cursoalummnoCtrl from "../controllers/cursoalumno.controller";
import { authorization, validation } from "../middlewares";

router.post(
  "/",
  [
    authorization.verifyToken,
    authorization.isCoordinador,
  ],
  cursoalummnoCtrl.createCursoAlumno
);

router.post(
  "/delete",
  [
    authorization.verifyToken,
    authorization.isAdministrador,
  ],
  cursoalummnoCtrl.deleteCursoAlumno
);

router.post(
  "/getalumnoscursopac",
  [
    authorization.verifyToken,    
    authorization.isDocente,
    authorization.accesoCurso,
  ],
  cursoalummnoCtrl.getAlumnosCursoPac
);

router.post(
  "/getlistadoalumnoscursopac",
  [
    authorization.verifyToken,    
    authorization.isDocente,
    authorization.accesoCurso,
  ],
  cursoalummnoCtrl.getListadoAlumnosCursoPac
);

router.post(
  "/getalumnosdisponiblespac",
  [
    authorization.verifyToken,    
    authorization.isCoordinador,
  ],
  cursoalummnoCtrl.getAlumnosDisponiblesPac
);

router.post(
  "/updatepersonalidadalumno",
  [
    authorization.verifyToken,    
    authorization.isDocente,
    authorization.accesoCurso,
  ],
  cursoalummnoCtrl.updatePersonalidadAlumno
);
router.get(
  "/getperiodos",
  [
    authorization.verifyToken,
  ],
  cursoalummnoCtrl.getPeriodosAlumno
);

export default router;