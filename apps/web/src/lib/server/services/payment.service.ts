import { db } from "../db";
import { payment, order, type Payment, type NewPayment } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { Errors, type ServiceResult, ok, fail } from "./utils";
import { OrderService } from "./order.service";

// Get environment variables
const PAKASIR_PROJECT_SLUG = process.env.PAKASIR_PROJECT_SLUG || "";
const PAKASIR_API_KEY = process.env.PAKASIR_API_KEY || "";
const PAKASIR_SANDBOX_MODE = process.env.PAKASIR_SANDBOX_MODE || "true";

// Pakasir API base URL
const PAKASIR_API_URL = "https://pakasir.com/api";

// Payment method display names
const PAYMENT_METHOD_NAMES: Record<string, string> = {
  qris: "QRIS",
  bni_va: "BNI Virtual Account",
  bri_va: "BRI Virtual Account",
  cimb_niaga_va: "CIMB Niaga Virtual Account",
  sampoerna_va: "Sampoerna Virtual Account",
  bnc_va: "BNC Virtual Account",
  maybank_va: "Maybank Virtual Account",
  permata_va: "Permata Virtual Account",
  atm_bersama_va: "ATM Bersama Virtual Account",
};

interface PakasirCreateResponse {
  success: boolean;
  data?: {
    qr_string?: string;
    va_number?: string;
    total: number;
    expired_at: string;
    order_id: string;
  };
  message?: string;
}

interface PakasirStatusResponse {
  success: boolean;
  data?: {
    order_id: string;
    status: "pending" | "paid" | "expired" | "cancelled";
    amount: number;
    payment_method: string;
    completed_at?: string;
  };
  message?: string;
}

export class PaymentService {
  /**
   * Create payment for order via Pakasir
   */
  static async create(
    orderId: string,
    method: string
  ): Promise<ServiceResult<Payment>> {
    // Get order
    const orderResult = await OrderService.getById(orderId);
    if (!orderResult.success) {
      return fail(orderResult.error);
    }

    const currentOrder = orderResult.data;

    // Validate order can be paid
    if (!["pending"].includes(currentOrder.status)) {
      return fail(
        Errors.badRequest(
          `Cannot create payment for ${currentOrder.status} order`
        )
      );
    }

    // Check if payment already exists
    const existingPayment = await db.query.payment.findFirst({
      where: and(eq(payment.orderId, orderId), eq(payment.status, "pending")),
    });

    if (existingPayment) {
      return ok(existingPayment);
    }

    // Create payment via Pakasir API
    const pakasirResponse = await this.createPakasirTransaction(
      orderId,
      currentOrder.total,
      method
    );

    if (!pakasirResponse.success || !pakasirResponse.data) {
      return fail(
        Errors.internal(pakasirResponse.message || "Payment gateway error")
      );
    }

    const { data } = pakasirResponse;

    // Save payment record
    const [createdPayment] = await db
      .insert(payment)
      .values({
        orderId,
        gateway: "pakasir",
        gatewayOrderId: data.order_id,
        method,
        methodName: PAYMENT_METHOD_NAMES[method] || method,
        amount: currentOrder.total,
        fee: 0,
        totalAmount: data.total,
        paymentNumber: data.qr_string || data.va_number || null,
        status: "pending",
        expiresAt: new Date(data.expired_at),
      })
      .returning();

    // Update order status
    await db
      .update(order)
      .set({
        status: "awaiting_payment",
        updatedAt: new Date(),
      })
      .where(eq(order.id, orderId));

    return ok(createdPayment);
  }

  /**
   * Check payment status
   */
  static async checkStatus(paymentId: string): Promise<ServiceResult<Payment>> {
    const existingPayment = await db.query.payment.findFirst({
      where: eq(payment.id, paymentId),
    });

    if (!existingPayment) {
      return fail(Errors.notFound("Payment"));
    }

    // If already completed, return as is
    if (["completed", "failed", "cancelled"].includes(existingPayment.status)) {
      return ok(existingPayment);
    }

    // Check with Pakasir
    const statusResponse = await this.getPakasirStatus(
      existingPayment.gatewayOrderId!
    );

    if (!statusResponse.success || !statusResponse.data) {
      return ok(existingPayment); // Return existing if API fails
    }

    const { data } = statusResponse;

    // Update payment status if changed
    if (data.status !== existingPayment.status) {
      const [updated] = await db
        .update(payment)
        .set({
          status: data.status,
          paidAt:
            data.status === "paid"
              ? new Date(data.completed_at || Date.now())
              : null,
          updatedAt: new Date(),
        })
        .where(eq(payment.id, paymentId))
        .returning();

      // If paid, trigger order completion
      if (data.status === "paid") {
        await OrderService.markAsPaid(existingPayment.orderId);
      }

      return ok(updated);
    }

    return ok(existingPayment);
  }

  /**
   * Handle Pakasir webhook
   */
  static async handleWebhook(data: {
    order_id: string;
    amount: number;
    status: string;
    payment_method: string;
    completed_at?: string;
  }): Promise<ServiceResult<void>> {
    // Find payment by gateway order ID
    const existingPayment = await db.query.payment.findFirst({
      where: eq(payment.gatewayOrderId, data.order_id),
    });

    if (!existingPayment) {
      return fail(Errors.notFound("Payment"));
    }

    // Update payment status
    await db
      .update(payment)
      .set({
        status: data.status === "paid" ? "completed" : data.status,
        paidAt:
          data.status === "paid"
            ? new Date(data.completed_at || Date.now())
            : null,
        webhookData: data,
        updatedAt: new Date(),
      })
      .where(eq(payment.id, existingPayment.id));

    // If paid, trigger order completion
    if (data.status === "paid") {
      await OrderService.markAsPaid(existingPayment.orderId);
    }

    return ok(undefined);
  }

  /**
   * Get payment by order ID
   */
  static async getByOrderId(orderId: string): Promise<Payment | null> {
    const result = await db.query.payment.findFirst({
      where: eq(payment.orderId, orderId),
      orderBy: [desc(payment.createdAt)],
    });
    return result ?? null;
  }

  // ============================================
  // Pakasir API Methods
  // ============================================

  private static async createPakasirTransaction(
    orderId: string,
    amount: number,
    method: string
  ): Promise<PakasirCreateResponse> {
    try {
      const response = await fetch(
        `${PAKASIR_API_URL}/transactioncreate/${method}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": PAKASIR_API_KEY,
          },
          body: JSON.stringify({
            project: PAKASIR_PROJECT_SLUG,
            order_id: orderId,
            amount,
          }),
        }
      );

      if (!response.ok) {
        return {
          success: false,
          message: `Pakasir API error: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private static async getPakasirStatus(
    gatewayOrderId: string
  ): Promise<PakasirStatusResponse> {
    try {
      const response = await fetch(
        `${PAKASIR_API_URL}/transactiondetail?order_id=${gatewayOrderId}`,
        {
          method: "GET",
          headers: {
            "X-API-Key": PAKASIR_API_KEY,
          },
        }
      );

      if (!response.ok) {
        return {
          success: false,
          message: `Pakasir API error: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Simulate payment (for sandbox/testing)
   */
  static async simulatePayment(orderId: string): Promise<ServiceResult<void>> {
    if (PAKASIR_SANDBOX_MODE !== "true") {
      return fail(
        Errors.badRequest("Simulation only available in sandbox mode")
      );
    }

    const existingPayment = await this.getByOrderId(orderId);
    if (!existingPayment) {
      return fail(Errors.notFound("Payment"));
    }

    try {
      await fetch(`${PAKASIR_API_URL}/paymentsimulation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": PAKASIR_API_KEY,
        },
        body: JSON.stringify({
          order_id: existingPayment.gatewayOrderId,
        }),
      });

      return ok(undefined);
    } catch (error) {
      return fail(Errors.internal("Failed to simulate payment"));
    }
  }
}
