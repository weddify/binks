import { json, error, type RequestHandler } from "@sveltejs/kit";
import { CouponService } from "$lib/server/services";

// POST /api/coupons/validate - Validate coupon code
export const POST: RequestHandler = async ({ request, locals }) => {
  const { code, orderTotal } = await request.json();

  if (!code) {
    return error(400, "Coupon code is required");
  }

  if (!orderTotal || orderTotal <= 0) {
    return error(400, "Valid order total is required");
  }

  const result = await CouponService.validate(
    code,
    orderTotal,
    locals.user?.id
  );

  if (!result.success) {
    return error(result.error.statusCode, result.error.message);
  }

  return json({
    valid: true,
    coupon: {
      code: result.data.coupon.code,
      type: result.data.coupon.type,
      value: result.data.coupon.value,
    },
    discountAmount: result.data.discountAmount,
  });
};
