import { Router } from "express";
import {
  APPLY_SPECIFIC_COUPON,
  CREATE_COUPON,
  GET_ALL_COUPONS,
  GET_APPLICABLE_COUPONS,
  GET_COUPON_BY_ID,
  DELETE_COUPON,
  UPDATE_COUPON,
} from "../Controllers/CouponsControllers.js";

const couponsRouter = Router();

couponsRouter.post("/add-new", CREATE_COUPON);
couponsRouter.get("/all", GET_ALL_COUPONS);
couponsRouter.get("/get/:id", GET_COUPON_BY_ID);
couponsRouter.delete("/delete/:id", DELETE_COUPON);
couponsRouter.put("/update/:id", UPDATE_COUPON);
couponsRouter.post("/applicable-coupons", GET_APPLICABLE_COUPONS);
couponsRouter.post("/apply-coupon/:id", APPLY_SPECIFIC_COUPON);
export default couponsRouter;
