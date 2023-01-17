import { Router } from "express";
const router = Router();

import * as resetTokenCtrl from "../controllers/resetToken.controller";
import { validation } from "../middlewares";



router.post(
  "/", resetTokenCtrl.createResetToken
);


export default router;