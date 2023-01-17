import { Router } from "express";
const router = Router();

import * as authCtrl from "../controllers/auth.controller";
import { validation,authorization } from "../middlewares";
const { body, validationResult } = require('express-validator');

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post(
  "/signup",
  [authorization.verifyToken,authorization.isCoordinador,validation.checkDuplicateUsernameOrEmail, validation.checkrolesExisted,body('email').isEmail().not().isEmpty()],
  authCtrl.signUp
);
router.post("/signin", authCtrl.signIn);
router.post("/signout", authCtrl.signOut);
router.post("/resetpass", authCtrl.resetPass);
router.post("/changepass",[authorization.verifyToken,], authCtrl.changePass);
export default router;