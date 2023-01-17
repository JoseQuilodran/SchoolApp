import { Router } from "express";
const router = Router();

import * as asignaturaalumnoCtrl from "../controllers/asignaturaalumno.controller";
import { authorization, validation } from "../middlewares";

router.post(
  "/",
  [
    authorization.verifyToken,  
    authorization.isCoordinador,  
  ],
  asignaturaalumnoCtrl.createAsignaturaAlumno
);
router.post(
  "/delete",
  [
    authorization.verifyToken,
    authorization.isAdministrador,
  ],
  asignaturaalumnoCtrl.deleteAsignaturaAlumno
);
router.post(
  "/update",
  [
    authorization.verifyToken,
    authorization.isDocente,
  ],
  asignaturaalumnoCtrl.updateAsignaturaAlumno
);
router.post(
  "/getalumnosasignatura",
  [
    authorization.verifyToken,    
  ],
  asignaturaalumnoCtrl.getAsignaturaAlumnos
);
router.post(
  "/getnotasasignatura",
  [
    authorization.verifyToken,
    authorization.isDocente,
    authorization.accesoAsignatura,    
  ],
  asignaturaalumnoCtrl.getNotasAsignatura
);
router.post(
  "/getalumnosdisponiblespac",
  [
    authorization.verifyToken, 
    authorization.isCoordinador,   
  ],
  asignaturaalumnoCtrl.getAlumnosDisponiblesPac
);


export default router;