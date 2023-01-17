import { Router } from "express";
const router = Router();

import * as cursopacsCtrl from "../controllers/cursopac.controller";
import { authorization, validation } from "../middlewares";

router.post(
  "/",
  [
    authorization.verifyToken,
    authorization.isAdministrador,
  ],
  cursopacsCtrl.createCursoPac
);
router.post(
  "/createallpac",
  [
    authorization.verifyToken,
    authorization.isAdministrador,
  ],
  cursopacsCtrl.createCursoPacAll
);
router.post(
  "/update",
  [
    authorization.verifyToken,
    authorization.isAdministrador,
  ],
  cursopacsCtrl.updateCursoPacs
);


router.get(
  "/getall",
  [
    authorization.verifyToken,    
  ],
  cursopacsCtrl.getCursoPacs
);
router.post(
  "/getallpac",
  [
    authorization.verifyToken,    
  ],
  cursopacsCtrl.getCursoPacs
);

router.get(
  "/getdisponibles",
  [
    authorization.verifyToken,  
    authorization.isDocente,  
  ],
  cursopacsCtrl.getCursoPacsDisponibles
);
export default router;