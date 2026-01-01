import { relations } from "drizzle-orm";
import { user, session, account } from "./schema/auth";
import { category } from "./schema/category";
import { productGroup, product } from "./schema/product";
import { stockItem } from "./schema/stock";
import { order, orderItem } from "./schema/order";
import { payment } from "./schema/payment";
import { coupon, couponUsage } from "./schema/coupon";
import { cartItem } from "./schema/cart";

// ============================================
// User Relations
// ============================================
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  orders: many(order),
  cartItems: many(cartItem),
  couponUsages: many(couponUsage),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// ============================================
// Category Relations (self-referencing)
// ============================================
export const categoryRelations = relations(category, ({ one, many }) => ({
  parent: one(category, {
    fields: [category.parentId],
    references: [category.id],
    relationName: "parentChild",
  }),
  children: many(category, { relationName: "parentChild" }),
  productGroups: many(productGroup),
}));

// ============================================
// Product Group Relations
// ============================================
export const productGroupRelations = relations(
  productGroup,
  ({ one, many }) => ({
    category: one(category, {
      fields: [productGroup.categoryId],
      references: [category.id],
    }),
    products: many(product),
  })
);

// ============================================
// Product Relations
// ============================================
export const productRelations = relations(product, ({ one, many }) => ({
  group: one(productGroup, {
    fields: [product.groupId],
    references: [productGroup.id],
  }),
  stockItems: many(stockItem),
  orderItems: many(orderItem),
  cartItems: many(cartItem),
}));

// ============================================
// Stock Item Relations
// ============================================
export const stockItemRelations = relations(stockItem, ({ one }) => ({
  product: one(product, {
    fields: [stockItem.productId],
    references: [product.id],
  }),
  orderItem: one(orderItem, {
    fields: [stockItem.orderItemId],
    references: [orderItem.id],
  }),
}));

// ============================================
// Order Relations
// ============================================
export const orderRelations = relations(order, ({ one, many }) => ({
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
  items: many(orderItem),
  payments: many(payment),
  coupon: one(coupon, {
    fields: [order.couponId],
    references: [coupon.id],
  }),
  couponUsage: many(couponUsage),
}));

export const orderItemRelations = relations(orderItem, ({ one, many }) => ({
  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id],
  }),
  product: one(product, {
    fields: [orderItem.productId],
    references: [product.id],
  }),
  stockItems: many(stockItem),
}));

// ============================================
// Payment Relations
// ============================================
export const paymentRelations = relations(payment, ({ one }) => ({
  order: one(order, {
    fields: [payment.orderId],
    references: [order.id],
  }),
}));

// ============================================
// Coupon Relations
// ============================================
export const couponRelations = relations(coupon, ({ many }) => ({
  usages: many(couponUsage),
  orders: many(order),
}));

export const couponUsageRelations = relations(couponUsage, ({ one }) => ({
  coupon: one(coupon, {
    fields: [couponUsage.couponId],
    references: [coupon.id],
  }),
  order: one(order, {
    fields: [couponUsage.orderId],
    references: [order.id],
  }),
  user: one(user, {
    fields: [couponUsage.userId],
    references: [user.id],
  }),
}));

// ============================================
// Cart Item Relations
// ============================================
export const cartItemRelations = relations(cartItem, ({ one }) => ({
  user: one(user, {
    fields: [cartItem.userId],
    references: [user.id],
  }),
  product: one(product, {
    fields: [cartItem.productId],
    references: [product.id],
  }),
}));
