# Admin Panel Walkthrough

This walkthrough demonstrates the comprehensive **Admin Panel** implemented for the Binks platform. The admin area is secured behind the `/admin` route and provides full control over the platform's operations.

## 1. Dashboard Overview

**Route**: `/admin`

The landing page provides a high-level view of business performance.

- **Key Metrics**: Real-time stats for Revenue, Orders, and Customers.
- **Recent Transactions**: quick view of the latest sales.
- **Payment Method Tracking**: See which payment methods are most popular.

## 2. Product Management

**Route**: `/admin/products`

Full control over your digital inventory.

### Product List

- Searchable table of all products.
- Quick status view (In Stock / Out of Stock).
- Visual "Edit" and "Delete" actions.

### Add/Edit Product

- **General Details**: Title, Slug, Pricing, Categories.
- **Stock Management Tab**:
  - **Bulk Upload**: Paste a list of `email:password` credentials.
  - **Inventory List**: See every individual account currently in stock.
  - **Pagination**: Efficiently manage large stock lists (10 items per page).

## 3. Order Management

**Route**: `/admin/orders`

Process and track customer orders.

- **Filtering**: Easily switch between `Paid`, `Pending`, and `Failed` orders.
- **Approval Workflow**: Visual "Check" and "X" buttons for approving pending manual payments.
- **Detailed View**: Click any order to see specific items and payment breakdown.

## 4. Customer Management

**Route**: `/admin/customers`

View your user base.

- **User List**: See registered customers and admins.
- **Role Badges**: Clearly distinguish between `ADMIN` and `CUSTOMER`.
- **Status Indicators**: Identify `ACTIVE` vs `BANNED` users.

## 5. Global Settings

**Route**: `/admin/settings`

Configure the store without touching code.

- **Store Identity**: Change Site Name, Currency, and SEO Descriptions.
- **Contact Info**: Update WhatsApp, Email, and Telegram details.
- **Feature Toggles**:
  - Enable/Disable Checkout.
  - Maintenance Mode (shutdown the site temporarily).
  - Toggle specific payment methods (QRIS, VA).
- **Interactive Save**: "Save Changes" button with loading state and success notification.

## Verification Checklist

| Feature              | Status | Notes                                            |
| :------------------- | :----- | :----------------------------------------------- |
| **Admin Layout**     | ✅     | Sidebar navigation works flawlessly.             |
| **Product CRUD**     | ✅     | Add/List/Edit/Stock Management fully functional. |
| **Order Processing** | ✅     | Filter/Search/Approve UI implemented.            |
| **Customer View**    | ✅     | List with search and badges works.               |
| **Settings**         | ✅     | Configuration inputs and save simulation work.   |

The Admin Panel is now **feature-complete** and ready for backend integration.
