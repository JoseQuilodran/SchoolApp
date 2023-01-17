import { Router } from "express";
const router = Router();

import * as comunaCtrl from "../controllers/comuna.controller";
import { authorization, validation } from "../middlewares";



router.get(
  "/getall",
  [
    authorization.verifyToken,    
  ],
  comunaCtrl.getall
);

export default router;