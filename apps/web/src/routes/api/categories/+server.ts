import { json, error, type RequestHandler } from "@sveltejs/kit";
import { CategoryService } from "$lib/server/services";

// GET /api/categories - List categories
export const GET: RequestHandler = async ({ url }) => {
  const includeInactive = url.searchParams.get("includeInactive") === "true";
  const parentId = url.searchParams.get("parentId");

  const categories = await CategoryService.getAll({
    includeInactive,
    parentId: parentId === "null" ? null : parentId ?? undefined,
  });

  return json(categories);
};

// POST /api/categories - Create category (admin only)
export const POST: RequestHandler = async ({ request, locals }) => {
  // Check admin authorization
  if (!locals.user || locals.user.role !== "admin") {
    return error(403, "Forbidden");
  }

  const data = await request.json();

  const result = await CategoryService.create(data);

  if (!result.success) {
    return error(result.error.statusCode, result.error.message);
  }

  return json(result.data, { status: 201 });
};
