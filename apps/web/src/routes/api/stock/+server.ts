import { json, error, type RequestHandler } from "@sveltejs/kit";
import { StockService } from "$lib/server/services";

// GET /api/stock - List stock items (admin only)
export const GET: RequestHandler = async ({ url, locals }) => {
  // Check admin authorization
  if (!locals.user || locals.user.role !== "admin") {
    return error(403, "Forbidden");
  }

  const productId = url.searchParams.get("productId");
  const status = url.searchParams.get("status") as
    | "available"
    | "reserved"
    | "sold"
    | undefined;
  const limit = parseInt(url.searchParams.get("limit") ?? "50", 10);
  const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);

  if (!productId) {
    return error(400, "Product ID is required");
  }

  const stockItems = await StockService.getByProduct(productId, {
    status,
    limit,
    offset,
  });

  return json(stockItems);
};

// POST /api/stock - Bulk upload stock items (admin only)
export const POST: RequestHandler = async ({ request, locals }) => {
  // Check admin authorization
  if (!locals.user || locals.user.role !== "admin") {
    return error(403, "Forbidden");
  }

  const { productId, items } = await request.json();

  if (!productId) {
    return error(400, "Product ID is required");
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return error(400, "At least one item is required");
  }

  const result = await StockService.bulkAdd(productId, items);

  if (!result.success) {
    return error(result.error.statusCode, result.error.message);
  }

  return json(
    {
      message: `Successfully added ${result.data.length} stock items`,
      count: result.data.length,
    },
    { status: 201 }
  );
};
