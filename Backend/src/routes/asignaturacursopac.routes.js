import { Router } from "express";
const router = Router();

import * as asignaturacursopacsCtrl from "../controllers/asignaturacursopac.controller";
import { authorization, validation } from "../middlewares";

router.post(
  "/",
  [
    authorization.verifyToken,
    authorization.isCoordinador,
  ],
  asignaturacursopacsCtrl.createAsignaturaCursoPac
);
router.post(
  "/update",
  [
    authorization.verifyToken,
    authorization.isCoordinador,
  ],
  asignaturacursopacsCtrl.updateAsignaturaCursoPacs
);


router.get(
  "/getall",
  [
    authorization.verifyToken,    
  ],
  asignaturacursopacsCtrl.getAsignaturaCursoPacs
);

router.post(
  "/getallcursopac",
  [
    authorization.verifyToken,    
  ],
  asignaturacursopacsCtrl.getAsignaturaCursoPacs
);

router.post(
  "/getasignaturasdisponibles",
  [
    authorization.verifyToken,    
    authorization.isCoordinador,
  ],
  asignaturacursopacsCtrl.getAsignaturasDisponibles
);

router.post(
  "/updateesquema",
  [
    authorization.verifyToken,    
    authorization.isDocente,
  ],
  asignaturacursopacsCtrl.updateEsquema
);
router.post(
  "/getesquema",
  [
    authorization.verifyToken,    
  ],
  asignaturacursopacsCtrl.getEsquema
);
router.post(
  "/deletenota",
  [
    authorization.verifyToken,    
  ],
  asignaturacursopacsCtrl.deleteNota
);
export default router;