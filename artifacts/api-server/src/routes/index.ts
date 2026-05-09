import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import giftsRouter from "./gifts";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(giftsRouter);
router.use(adminRouter);

export default router;
