import { json, type RequestHandler } from "@sveltejs/kit";
import { PaymentService } from "$lib/server/services";

// POST /api/webhooks/pakasir - Pakasir payment webhook
export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();

    // Log webhook for debugging
    console.log("[Pakasir Webhook] Received:", JSON.stringify(data));

    // Validate required fields
    if (!data.order_id || !data.status) {
      console.error("[Pakasir Webhook] Invalid payload:", data);
      return json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    // Process the webhook
    const result = await PaymentService.handleWebhook({
      order_id: data.order_id,
      amount: data.amount,
      status: data.status,
      payment_method: data.payment_method,
      completed_at: data.completed_at,
    });

    if (!result.success) {
      console.error(
        "[Pakasir Webhook] Processing error:",
        result.error.message
      );
      return json(
        { success: false, message: result.error.message },
        { status: result.error.statusCode }
      );
    }

    console.log(
      "[Pakasir Webhook] Processed successfully for order:",
      data.order_id
    );
    return json({ success: true, message: "Webhook processed" });
  } catch (err) {
    console.error("[Pakasir Webhook] Error:", err);
    return json({ success: false, message: "Internal error" }, { status: 500 });
  }
};
