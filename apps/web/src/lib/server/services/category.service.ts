import { db } from "../db";
import { category, type Category, type NewCategory } from "../db/schema";
import { eq, isNull, asc, and, or, SQL } from "drizzle-orm";
import { Errors, type ServiceResult, ok, fail } from "./utils";

export class CategoryService {
  /**
   * Get all categories with optional filtering
   */
  static async getAll(options?: {
    includeInactive?: boolean;
    parentId?: string | null;
  }): Promise<Category[]> {
    const conditions: SQL[] = [];

    if (!options?.includeInactive) {
      conditions.push(eq(category.isActive, true));
    }

    if (options?.parentId === null) {
      conditions.push(isNull(category.parentId));
    } else if (options?.parentId) {
      conditions.push(eq(category.parentId, options.parentId));
    }

    return await db.query.category.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: [asc(category.sortOrder)],
      with: {
        children: true,
        productGroups: {
          with: {
            products: true,
          },
        },
      },
    });
  }

  /**
   * Get category by ID or slug
   */
  static async getByIdOrSlug(
    idOrSlug: string
  ): Promise<ServiceResult<Category>> {
    const result = await db.query.category.findFirst({
      where: or(eq(category.id, idOrSlug), eq(category.slug, idOrSlug)),
      with: {
        parent: true,
        children: true,
        productGroups: {
          with: {
            products: true,
          },
        },
      },
    });

    if (!result) {
      return fail(Errors.notFound("Category"));
    }

    return ok(result);
  }

  /**
   * Create new category
   */
  static async create(data: NewCategory): Promise<ServiceResult<Category>> {
    // Check if slug already exists
    const existing = await db.query.category.findFirst({
      where: eq(category.slug, data.slug),
    });

    if (existing) {
      return fail(Errors.conflict("Category with this slug already exists"));
    }

    const [created] = await db.insert(category).values(data).returning();
    return ok(created);
  }

  /**
   * Update category
   */
  static async update(
    id: string,
    data: Partial<NewCategory>
  ): Promise<ServiceResult<Category>> {
    // Check if category exists
    const existing = await db.query.category.findFirst({
      where: eq(category.id, id),
    });

    if (!existing) {
      return fail(Errors.notFound("Category"));
    }

    // If slug is being updated, check for conflicts
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await db.query.category.findFirst({
        where: eq(category.slug, data.slug),
      });

      if (slugExists) {
        return fail(Errors.conflict("Category with this slug already exists"));
      }
    }

    const [updated] = await db
      .update(category)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(category.id, id))
      .returning();

    return ok(updated);
  }

  /**
   * Delete category
   */
  static async delete(id: string): Promise<ServiceResult<void>> {
    const existing = await db.query.category.findFirst({
      where: eq(category.id, id),
      with: { productGroups: true },
    });

    if (!existing) {
      return fail(Errors.notFound("Category"));
    }

    // Check if category has products
    const productGroups = existing.productGroups as unknown[];
    if (productGroups && productGroups.length > 0) {
      return fail(Errors.badRequest("Cannot delete category with products"));
    }

    await db.delete(category).where(eq(category.id, id));
    return ok(undefined);
  }

  /**
   * Get category hierarchy (tree structure)
   */
  static async getHierarchy(): Promise<Category[]> {
    // Get root categories with all children
    return await db.query.category.findMany({
      where: isNull(category.parentId),
      orderBy: [asc(category.sortOrder)],
      with: {
        children: {
          with: {
            children: true,
          },
        },
      },
    });
  }
}
