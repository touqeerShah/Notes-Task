import authRouter from "./users/auth.routes";
import userProfile from "./users/user.routes";
import errorRouter from "./users/error.routes";
import taskRouter from "./task/";


import express from "express";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userProfile);
router.use("/auth", errorRouter);
router.use("/task", taskRouter);


export { router };