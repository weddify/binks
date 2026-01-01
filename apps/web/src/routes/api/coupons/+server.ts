import { json, error, type RequestHandler } from "@sveltejs/kit";
import { CouponService } from "$lib/server/services";

// GET /api/coupons - List all coupons (admin only)
export const GET: RequestHandler = async ({ url, locals }) => {
  // Check admin authorization
  if (!locals.user || locals.user.role !== "admin") {
    return error(403, "Forbidden");
  }

  const includeInactive = url.searchParams.get("includeInactive") === "true";
  const limit = parseInt(url.searchParams.get("limit") ?? "50", 10);
  const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);

  const coupons = await CouponService.getAll({
    includeInactive,
    limit,
    offset,
  });

  return json(coupons);
};

// POST /api/coupons - Create coupon (admin only)
export const POST: RequestHandler = async ({ request, locals }) => {
  // Check admin authorization
  if (!locals.user || locals.user.role !== "admin") {
    return error(403, "Forbidden");
  }

  const data = await request.json();

  const result = await CouponService.create(data);

  if (!result.success) {
    return error(result.error.statusCode, result.error.message);
  }

  return json(result.data, { status: 201 });
};
