// ============================================
// Services Index - Export all services
// ============================================

export { ServiceError, Errors, ok, fail, type ServiceResult } from "./utils";

export { CategoryService } from "./category.service";
export { ProductService } from "./product.service";
export { StockService } from "./stock.service";
export { OrderService, type CreateOrderInput } from "./order.service";
export { PaymentService } from "./payment.service";
export { CouponService } from "./coupon.service";

// Placeholder exports for services to be implemented
// export { CartService } from './cart.service';
// export { PageService } from './page.service';
// export { SettingsService } from './settings.service';
