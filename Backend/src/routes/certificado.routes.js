import { Router } from "express";
const router = Router();

import * as certificadoCtrl from "../controllers/certificado.controller";
import { authorization, validation } from "../middlewares";

router.post(
  "/",
  [authorization.verifyToken],
  certificadoCtrl.generateCertificado
);

export default router;
