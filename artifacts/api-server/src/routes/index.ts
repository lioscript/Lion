import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import giftsRouter from "./gifts";
import adminRouter from "./admin";
import promosRouter from "./promos";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(giftsRouter);
router.use(adminRouter);
router.use(promosRouter);

export default router;
