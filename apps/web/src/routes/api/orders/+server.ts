import { json, error, type RequestHandler } from "@sveltejs/kit";
import { OrderService, type CreateOrderInput } from "$lib/server/services";

// GET /api/orders - List orders
export const GET: RequestHandler = async ({ url, locals }) => {
  const status = url.searchParams.get("status") ?? undefined;
  const limit = parseInt(url.searchParams.get("limit") ?? "50", 10);
  const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);

  // For non-admin users, only show their own orders
  const userId = locals.user?.role !== "admin" ? locals.user?.id : undefined;

  const result = await OrderService.getAll({
    userId,
    status,
    limit,
    offset,
  });

  return json(result);
};

// POST /api/orders - Create order (checkout)
export const POST: RequestHandler = async ({ request, locals }) => {
  const body = await request.json();

  const input: CreateOrderInput = {
    buyerEmail: body.buyerEmail,
    buyerPhone: body.buyerPhone,
    buyerName: body.buyerName,
    userId: locals.user?.id,
    items: body.items,
    couponCode: body.couponCode,
  };

  // Validate required fields
  if (!input.buyerEmail) {
    return error(400, "Buyer email is required");
  }

  if (!input.items || input.items.length === 0) {
    return error(400, "At least one item is required");
  }

  const result = await OrderService.create(input);

  if (!result.success) {
    return error(result.error.statusCode, result.error.message);
  }

  return json(result.data, { status: 201 });
};
