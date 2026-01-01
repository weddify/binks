import { json, error, type RequestHandler } from "@sveltejs/kit";
import { PaymentService } from "$lib/server/services";

// POST /api/payments/create - Create payment for order
export const POST: RequestHandler = async ({ request }) => {
  const { orderId, method } = await request.json();

  if (!orderId) {
    return error(400, "Order ID is required");
  }

  if (!method) {
    return error(400, "Payment method is required");
  }

  const result = await PaymentService.create(orderId, method);

  if (!result.success) {
    return error(result.error.statusCode, result.error.message);
  }

  return json(result.data, { status: 201 });
};
