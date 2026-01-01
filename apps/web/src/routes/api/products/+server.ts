import { json, error, type RequestHandler } from "@sveltejs/kit";
import { ProductService } from "$lib/server/services";

// GET /api/products - List products
export const GET: RequestHandler = async ({ url }) => {
  const search = url.searchParams.get("search") ?? undefined;
  const groupId = url.searchParams.get("groupId") ?? undefined;
  const limit = parseInt(url.searchParams.get("limit") ?? "50", 10);
  const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);
  const sortBy =
    (url.searchParams.get("sortBy") as "price" | "sold" | "created" | "name") ??
    "created";
  const sortOrder =
    (url.searchParams.get("sortOrder") as "asc" | "desc") ?? "desc";

  const result = await ProductService.getAll({
    search,
    groupId,
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  return json(result);
};

// POST /api/products - Create product (admin only)
export const POST: RequestHandler = async ({ request, locals }) => {
  // Check admin authorization
  if (!locals.user || locals.user.role !== "admin") {
    return error(403, "Forbidden");
  }

  const data = await request.json();

  const result = await ProductService.create(data);

  if (!result.success) {
    return error(result.error.statusCode, result.error.message);
  }

  return json(result.data, { status: 201 });
};
