import { CouponModel } from "../Database/CouponModel.js";

export const CREATE_COUPON = async (req, res) => {
  const { type, details, expirationDate } = req.body;
  try {
    const coupon = await new CouponModel({
      type,
      details,
      expirationDate,
    });

    await coupon.save();

    return res.status(201).json({ message: "Coupon created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const GET_ALL_COUPONS = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const startIndex = (page - 1) * limit;

  try {
    const coupons = await CouponModel.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);

    const totalCoupons = await CouponModel.countDocuments();
    if (totalCoupons === 0) {
      return res.status(404).json({ message: "No coupons found" });
    }

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalCoupons / limit),
      hasNextPage: startIndex + limit < totalCoupons,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalCoupons / limit),
    };
    return res
      .status(200)
      .json({ message: " Coupons fetched successfully ", coupons, pagination });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const GET_COUPON_BY_ID = async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await CouponModel.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    return res
      .status(200)
      .json({ message: "Coupon fetched successfully", coupon });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const UPDATE_COUPON = async (req, res) => {
  const { id } = req.params;
  const { type, details, expirationDate } = req.body;
  try {
    const coupon = await CouponModel.findByIdAndUpdate(
      id,
      {
        type,
        details,
        expirationDate,
      },
      { new: true }
    );
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    return res
      .status(200)
      .json({ message: "Coupon updated successfully", coupon });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const DELETE_COUPON = async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await CouponModel.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    return res
      .status(200)
      .json({ message: "Coupon deleted successfully", coupon });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const GET_APPLICABLE_COUPONS = async (req, res) => {
  const { cart } = req.body;
  try {
    const coupons = await CouponModel.find();
    let applicableCoupons = [];

    coupons.forEach((coupon) => {
      if (coupon.type === "cart-wise") {
        // Cart-wise: Check if the cart total exceeds the threshold
        let cartTotal = cart.items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        if (cartTotal > coupon.details.threshold) {
          applicableCoupons.push({
            coupon_id: coupon._id,
            type: coupon.type,
            discount: (cartTotal * coupon.details.discount) / 100,
          });
        }
      } else if (coupon.type === "product-wise") {
        // Product-wise: Check if specific product is in the cart
        const product = cart.items.find(
          (item) => item.product_id === coupon.details.product_id
        );
        if (product) {
          applicableCoupons.push({
            coupon_id: coupon._id,
            type: coupon.type,
            discount:
              (product.price * product.quantity * coupon.details.discount) /
              100,
          });
        }
      } else if (coupon.type === "bxgy") {
        // BxGy: Check if the required number of products are present
        let buyTotal = 0,
          getFreeProducts = 0;
        coupon.details.buy_products.forEach((buy) => {
          const cartProduct = cart.items.find(
            (item) => item.product_id === buy.product_id
          );
          if (cartProduct) {
            buyTotal += Math.floor(cartProduct.quantity / buy.quantity);
          }
        });

        coupon.details.get_products.forEach((get) => {
          getFreeProducts +=
            get.quantity * Math.min(buyTotal, coupon.repetition_limit);
        });

        if (getFreeProducts > 0) {
          const freeProduct = cart.items.find(
            (item) =>
              item.product_id === coupon.details.get_products[0].product_id
          );
          const freeAmount = freeProduct
            ? freeProduct.price * getFreeProducts
            : 0;
          applicableCoupons.push({
            coupon_id: coupon._id,
            type: coupon.type,
            discount: freeAmount,
          });
        }
      }
    });

    return res
      .status(200)
      .json({ message: "Coupons fetched successfully", applicableCoupons });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const APPLY_SPECIFIC_COUPON = async (req, res) => {
  const { id } = req.params;
  const { cart } = req.body;

  try {
    const coupon = await CouponModel.findById(id);

    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    let totalDiscount = 0;

    if (coupon.type === "cart-wise") {
      let cartTotal = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      if (cartTotal > coupon.details.threshold) {
        totalDiscount = (cartTotal * coupon.details.discount) / 100;
      }
    } else if (coupon.type === "product-wise") {
      const product = cart.items.find(
        (item) => item.product_id === coupon.details.product_id
      );
      if (product) {
        totalDiscount =
          (product.price * product.quantity * coupon.details.discount) / 100;
      }
    } else if (coupon.type === "bxgy") {
      let buyTotal = 0,
        getFreeProducts = 0;
      coupon.details.buy_products.forEach((buy) => {
        const cartProduct = cart.items.find(
          (item) => item.product_id === buy.product_id
        );
        if (cartProduct) {
          buyTotal += Math.floor(cartProduct.quantity / buy.quantity);
        }
      });

      coupon.details.get_products.forEach((get) => {
        getFreeProducts +=
          get.quantity * Math.min(buyTotal, coupon.repetition_limit);
      });

      if (getFreeProducts > 0) {
        const freeProduct = cart.items.find(
          (item) =>
            item.product_id === coupon.details.get_products[0].product_id
        );
        if (freeProduct) {
          freeProduct.quantity += getFreeProducts;
          totalDiscount = freeProduct.price * getFreeProducts;
        }
      }
    }

    res.status(200).json({
      updated_cart: {
        ...cart,
        total_discount: totalDiscount,
        final_price:
          cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          ) - totalDiscount,
      },
      message: "Coupon applied successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
