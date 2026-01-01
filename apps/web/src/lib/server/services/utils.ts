// Service Error Class
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

// Common error factory functions
export const Errors = {
  notFound: (resource: string) =>
    new ServiceError(`${resource} not found`, "NOT_FOUND", 404),

  unauthorized: (message = "Unauthorized") =>
    new ServiceError(message, "UNAUTHORIZED", 401),

  forbidden: (message = "Forbidden") =>
    new ServiceError(message, "FORBIDDEN", 403),

  badRequest: (message: string) =>
    new ServiceError(message, "BAD_REQUEST", 400),

  conflict: (message: string) => new ServiceError(message, "CONFLICT", 409),

  internal: (message = "Internal server error") =>
    new ServiceError(message, "INTERNAL_ERROR", 500),

  validation: (message: string) =>
    new ServiceError(message, "VALIDATION_ERROR", 422),

  insufficientStock: (productId: string) =>
    new ServiceError(
      `Insufficient stock for product ${productId}`,
      "INSUFFICIENT_STOCK",
      400
    ),

  expiredOrder: () =>
    new ServiceError("Order has expired", "ORDER_EXPIRED", 400),

  invalidCoupon: (reason: string) =>
    new ServiceError(`Invalid coupon: ${reason}`, "INVALID_COUPON", 400),
};

// Result wrapper for service operations
export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: ServiceError };

// Helper to wrap service operations
export function ok<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

export function fail<T>(error: ServiceError): ServiceResult<T> {
  return { success: false, error };
}
