import { model, Schema } from "mongoose";

const couponSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["cart-wise", "product-wise", "bxgy"],
      required: true,
    },
    details: {
      type: Schema.Types.Mixed,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const CouponModel = model("Coupon", couponSchema);
