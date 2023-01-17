import { Router } from "express";
const router = Router();

import * as asisteCtrl from "../controllers/asiste.controller";
import { authorization, validation } from "../middlewares";

router.post(
  "/getasistesemana",
  [
    authorization.verifyToken,
    authorization.isDocente,
  ],
  asisteCtrl.getAsisteSemana
);

router.post(
  "/update",
  [
    authorization.verifyToken,
    authorization.isDocente,
    authorization.accesoCurso,
  ],
  asisteCtrl.updateAsiste
);

export default router;