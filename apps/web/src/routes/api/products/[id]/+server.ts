import { json, error, type RequestHandler } from "@sveltejs/kit";
import { ProductService } from "$lib/server/services";

// GET /api/products/[id] - Get product by ID or slug
export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return error(400, "Product ID is required");
  }

  const result = await ProductService.getByIdOrSlug(id);

  if (!result.success) {
    return error(result.error.statusCode, result.error.message);
  }

  return json(result.data);
};

// PUT /api/products/[id] - Update product (admin only)
export const PUT: RequestHandler = async ({ params, request, locals }) => {
  // Check admin authorization
  if (!locals.user || locals.user.role !== "admin") {
    return error(403, "Forbidden");
  }

  const { id } = params;
  if (!id) {
    return error(400, "Product ID is required");
  }

  const data = await request.json();
  const result = await ProductService.update(id, data);

  if (!result.success) {
    return error(result.error.statusCode, result.error.message);
  }

  return json(result.data);
};

// DELETE /api/products/[id] - Delete product (admin only)
export const DELETE: RequestHandler = async ({ params, locals }) => {
  // Check admin authorization
  if (!locals.user || locals.user.role !== "admin") {
    return error(403, "Forbidden");
  }

  const { id } = params;
  if (!id) {
    return error(400, "Product ID is required");
  }

  const result = await ProductService.delete(id);

  if (!result.success) {
    return error(result.error.statusCode, result.error.message);
  }

  return new Response(null, { status: 204 });
};
