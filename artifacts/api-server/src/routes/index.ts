import { Router, type IRouter } from "express";
import healthRouter from "./health";
import patientsRouter from "./patients";
import assessmentsRouter from "./assessments";
import analyticsRouter from "./analytics";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/api/patients", patientsRouter);
router.use("/api/assessments", assessmentsRouter);
router.use("/api/analytics", analyticsRouter);

export default router;
