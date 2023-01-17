import { Router } from "express";
const router = Router();

import * as estadoPersonalidadCtrl from "../controllers/estadoPersonalidad.controller";
import { authorization, validation } from "../middlewares";


router.get(
  "/getall",
  [
    authorization.verifyToken,    
    authorization.isDocente,
  ],
  estadoPersonalidadCtrl.getEstados
);

export default router;