import { json, error, type RequestHandler } from "@sveltejs/kit";
import { OrderService } from "$lib/server/services";

// GET /api/orders/[id] - Get order by ID
export const GET: RequestHandler = async ({ params, locals }) => {
  const { id } = params;

  if (!id) {
    return error(400, "Order ID is required");
  }

  const result = await OrderService.getById(id);

  if (!result.success) {
    return error(result.error.statusCode, result.error.message);
  }

  // Non-admin users can only view their own orders
  if (locals.user?.role !== "admin") {
    if (
      result.data.userId !== locals.user?.id &&
      result.data.buyerEmail !== locals.user?.email
    ) {
      return error(403, "Forbidden");
    }
  }

  return json(result.data);
};

// PUT /api/orders/[id] - Update order (admin only)
export const PUT: RequestHandler = async ({ params, request, locals }) => {
  // Check admin authorization
  if (!locals.user || locals.user.role !== "admin") {
    return error(403, "Forbidden");
  }

  const { id } = params;
  if (!id) {
    return error(400, "Order ID is required");
  }

  const { status } = await request.json();

  if (!status) {
    return error(400, "Status is required");
  }

  const result = await OrderService.updateStatus(id, status);

  if (!result.success) {
    return error(result.error.statusCode, result.error.message);
  }

  return json(result.data);
};
