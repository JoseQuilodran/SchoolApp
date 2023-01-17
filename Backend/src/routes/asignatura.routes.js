import { Router } from "express";
const router = Router();

import * as asignaturaCtrl from "../controllers/asignatura.controller";
import { authorization, validation } from "../middlewares";

router.post(
  "/",
  [
    authorization.verifyToken,
    authorization.isCoordinador,
  ],
  asignaturaCtrl.createAsignatura
);

router.get(
  "/getall",
  [
    authorization.verifyToken,    
  ],
  asignaturaCtrl.getAsignaturas
);

router.patch(
  "/update",
  [
    authorization.verifyToken,   
    authorization.isAdministrador, 
  ],
  asignaturaCtrl.updateAsignaturas
);


export default router;