import { Router } from "express";
import couponsRouter from "./Routes/couponsRoute.js";

const indexRouter = Router();

indexRouter.use("/coupons", couponsRouter);

export default indexRouter;
