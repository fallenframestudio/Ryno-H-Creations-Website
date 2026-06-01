import { Router, type IRouter } from "express";
import healthRouter from "./health";
import paintingsRouter from "./paintings";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(paintingsRouter);
router.use(adminRouter);

export default router;
