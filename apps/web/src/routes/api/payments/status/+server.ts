import { json, error, type RequestHandler } from "@sveltejs/kit";
import { PaymentService } from "$lib/server/services";

// GET /api/payments/status - Check payment status
export const GET: RequestHandler = async ({ url }) => {
  const paymentId = url.searchParams.get("paymentId");
  const orderId = url.searchParams.get("orderId");

  if (!paymentId && !orderId) {
    return error(400, "Either paymentId or orderId is required");
  }

  let payment;

  if (paymentId) {
    const result = await PaymentService.checkStatus(paymentId);
    if (!result.success) {
      return error(result.error.statusCode, result.error.message);
    }
    payment = result.data;
  } else if (orderId) {
    payment = await PaymentService.getByOrderId(orderId);
    if (!payment) {
      return error(404, "Payment not found");
    }
  }

  return json(payment);
};
