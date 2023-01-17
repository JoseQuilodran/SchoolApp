import { Router } from "express";
const router = Router();

import * as informeCtrl from "../controllers/informe.controller";
import { authorization, validation } from "../middlewares";

router.post(
  "/getpdf",
  [authorization.verifyToken,
  authorization.isDocente],
  informeCtrl.generateInforme
);

export default router;
