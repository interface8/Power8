import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Package,
  Layers3,
  Boxes,
  Users,
  Sun,
  Image,
  MessageSquareQuote,
  BookOpen,
  FolderTree,
  Shield,
  KeyRound,
  FileText,
  Building2,
  Clock,
} from "lucide-react";

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

export interface PermissionGroup {
  resource: string;
  label: string;
  icon: React.ElementType;
  permissions: Permission[];
}

// Generate all permissions
export const allPermissions: Permission[] = [
  // Dashboard
  { id: "dashboard_view", name: "View stats", resource: "dashboard", action: "view", description: "Access dashboard statistics" },
  
  // Orders
  { id: "orders_view_list", name: "View list", resource: "orders", action: "view_list", description: "See all orders" },
  { id: "orders_view_detail", name: "View detail", resource: "orders", action: "view_detail", description: "See individual order details" },
  { id: "orders_update_status", name: "Update status", resource: "orders", action: "update_status", description: "Change order status" },
  { id: "orders_update_shipping", name: "Update shipping status", resource: "orders", action: "update_shipping", description: "Change shipping status" },
  
  // Credit Accounts
  { id: "credit_view_list", name: "View list", resource: "credit", action: "view_list", description: "See all credit accounts" },
  { id: "credit_view_detail", name: "View detail", resource: "credit", action: "view_detail", description: "See individual credit account" },
  { id: "credit_update_status", name: "Update status", resource: "credit", action: "update_status", description: "Change credit account status" },
  
  // Payment Schedules
  { id: "payment_schedules_view", name: "View", resource: "payment_schedules", action: "view", description: "See payment schedules" },
  { id: "payment_schedules_mark_paid", name: "Mark as paid", resource: "payment_schedules", action: "mark_paid", description: "Mark payments as paid" },
  
  // Products
  { id: "products_view", name: "View", resource: "products", action: "view", description: "See product list" },
  { id: "products_create", name: "Create", resource: "products", action: "create", description: "Add new products" },
  { id: "products_edit", name: "Edit", resource: "products", action: "edit", description: "Modify product details" },
  { id: "products_delete", name: "Delete", resource: "products", action: "delete", description: "Remove products" },
  { id: "products_update_stock", name: "Update stock", resource: "products", action: "update_stock", description: "Manage inventory levels" },
  
  // Categories
  { id: "categories_view", name: "View", resource: "categories", action: "view", description: "See category list" },
  { id: "categories_create", name: "Create", resource: "categories", action: "create", description: "Add new categories" },
  { id: "categories_edit", name: "Edit", resource: "categories", action: "edit", description: "Modify categories" },
  { id: "categories_delete", name: "Delete", resource: "categories", action: "delete", description: "Remove categories" },
  
  // Bundles
  { id: "bundles_view", name: "View", resource: "bundles", action: "view", description: "See bundle list" },
  { id: "bundles_create", name: "Create", resource: "bundles", action: "create", description: "Add new bundles" },
  { id: "bundles_edit", name: "Edit", resource: "bundles", action: "edit", description: "Modify bundles" },
  { id: "bundles_delete", name: "Delete", resource: "bundles", action: "delete", description: "Remove bundles" },
  
  // Files
  { id: "files_view", name: "View", resource: "files", action: "view", description: "See uploaded files" },
  { id: "files_upload", name: "Upload", resource: "files", action: "upload", description: "Upload new files" },
  { id: "files_delete", name: "Delete", resource: "files", action: "delete", description: "Delete files" },
  
  // Companies
  { id: "companies_view", name: "View", resource: "companies", action: "view", description: "See companies" },
  { id: "companies_create", name: "Create", resource: "companies", action: "create", description: "Add new companies" },
  { id: "companies_edit", name: "Edit", resource: "companies", action: "edit", description: "Modify companies" },
  { id: "companies_delete", name: "Delete", resource: "companies", action: "delete", description: "Remove companies" },
  
  // Users
  { id: "users_view_list", name: "View list", resource: "users", action: "view_list", description: "See all users" },
  { id: "users_view_detail", name: "View detail", resource: "users", action: "view_detail", description: "See individual user" },
  { id: "users_activate", name: "Activate/Deactivate", resource: "users", action: "activate", description: "Manage user status" },
  
  // Solar Systems
  { id: "solar_view_list", name: "View list", resource: "solar", action: "view_list", description: "See all solar systems" },
  { id: "solar_enable", name: "Enable", resource: "solar", action: "enable", description: "Activate solar systems" },
  { id: "solar_limit", name: "Limit", resource: "solar", action: "limit", description: "Configure system limits" },
  { id: "solar_disable", name: "Disable", resource: "solar", action: "disable", description: "Deactivate systems" },
  { id: "solar_view_logs", name: "View logs", resource: "solar", action: "view_logs", description: "See system activity" },
  
  // Carousel
  { id: "carousel_view", name: "View", resource: "carousel", action: "view", description: "See carousel items" },
  { id: "carousel_create", name: "Create", resource: "carousel", action: "create", description: "Add carousel slides" },
  { id: "carousel_edit", name: "Edit", resource: "carousel", action: "edit", description: "Modify carousel" },
  { id: "carousel_delete", name: "Delete", resource: "carousel", action: "delete", description: "Remove carousel slides" },
  
  // Testimonials
  { id: "testimonials_view", name: "View", resource: "testimonials", action: "view", description: "See testimonials" },
  { id: "testimonials_approve", name: "Approve", resource: "testimonials", action: "approve", description: "Publish testimonials" },
  { id: "testimonials_reject", name: "Reject", resource: "testimonials", action: "reject", description: "Remove testimonials" },
  
  // Blog
  { id: "blog_view", name: "View", resource: "blog", action: "view", description: "See blog posts" },
  { id: "blog_create", name: "Create", resource: "blog", action: "create", description: "Write new posts" },
  { id: "blog_edit", name: "Edit", resource: "blog", action: "edit", description: "Modify posts" },
  { id: "blog_delete", name: "Delete", resource: "blog", action: "delete", description: "Remove posts" },
  { id: "blog_publish", name: "Publish", resource: "blog", action: "publish", description: "Publish/unpublish posts" },
  
  // Blog Categories
  { id: "blog_categories_view", name: "View", resource: "blog_categories", action: "view", description: "See categories" },
  { id: "blog_categories_create", name: "Create", resource: "blog_categories", action: "create", description: "Add categories" },
  { id: "blog_categories_edit", name: "Edit", resource: "blog_categories", action: "edit", description: "Modify categories" },
  { id: "blog_categories_delete", name: "Delete", resource: "blog_categories", action: "delete", description: "Remove categories" },
  
  // Roles
  { id: "roles_view", name: "View", resource: "roles", action: "view", description: "See role list" },
  { id: "roles_create", name: "Create", resource: "roles", action: "create", description: "Add new roles" },
  { id: "roles_edit", name: "Edit", resource: "roles", action: "edit", description: "Modify roles" },
  { id: "roles_delete", name: "Delete", resource: "roles", action: "delete", description: "Remove roles" },
  
  // Permissions
  { id: "permissions_assign", name: "Assign permissions to roles", resource: "permissions", action: "assign", description: "Manage role permissions" },
  
  // Audit Logs
  { id: "audit_logs_view", name: "View", resource: "audit_logs", action: "view", description: "See system audit logs" },
];

export const permissionGroups: PermissionGroup[] = [
  { resource: "dashboard", label: "Dashboard", icon: LayoutDashboard, permissions: allPermissions.filter(p => p.resource === "dashboard") },
  { resource: "orders", label: "Orders", icon: ShoppingCart, permissions: allPermissions.filter(p => p.resource === "orders") },
  { resource: "credit", label: "Credit Accounts", icon: CreditCard, permissions: allPermissions.filter(p => p.resource === "credit") },
  { resource: "payment_schedules", label: "Payment Schedules", icon: Clock, permissions: allPermissions.filter(p => p.resource === "payment_schedules") },
  { resource: "products", label: "Products", icon: Package, permissions: allPermissions.filter(p => p.resource === "products") },
  { resource: "categories", label: "Categories", icon: Layers3, permissions: allPermissions.filter(p => p.resource === "categories") },
  { resource: "bundles", label: "Bundles", icon: Boxes, permissions: allPermissions.filter(p => p.resource === "bundles") },
  { resource: "files", label: "Files", icon: FileText, permissions: allPermissions.filter(p => p.resource === "files") },
  { resource: "companies", label: "Companies", icon: Building2, permissions: allPermissions.filter(p => p.resource === "companies") },
  { resource: "users", label: "Users", icon: Users, permissions: allPermissions.filter(p => p.resource === "users") },
  { resource: "solar", label: "Solar Systems", icon: Sun, permissions: allPermissions.filter(p => p.resource === "solar") },
  { resource: "carousel", label: "Carousel", icon: Image, permissions: allPermissions.filter(p => p.resource === "carousel") },
  { resource: "testimonials", label: "Testimonials", icon: MessageSquareQuote, permissions: allPermissions.filter(p => p.resource === "testimonials") },
  { resource: "blog", label: "Blog", icon: BookOpen, permissions: allPermissions.filter(p => p.resource === "blog") },
  { resource: "blog_categories", label: "Blog Categories", icon: FolderTree, permissions: allPermissions.filter(p => p.resource === "blog_categories") },
  { resource: "roles", label: "Roles", icon: Shield, permissions: allPermissions.filter(p => p.resource === "roles") },
  { resource: "permissions", label: "Permissions", icon: KeyRound, permissions: allPermissions.filter(p => p.resource === "permissions") },
  { resource: "audit_logs", label: "Audit Logs", icon: Clock, permissions: allPermissions.filter(p => p.resource === "audit_logs") },
];

// Dummy role permissions data
export const getDummyRolePermissions = (roleId: string): string[] => {
  const rolePermissionsMap: Record<string, string[]> = {
    "1": allPermissions.map(p => p.id), // Admin has all permissions
    "2": [ // Customer
      "orders_view_list", "orders_view_detail",
      "credit_view_list", "credit_view_detail",
      "products_view",
      "solar_view_list",
    ],
    "3": allPermissions.map(p => p.id).filter(id => 
      id.includes("view") && !id.includes("create") && !id.includes("edit") && !id.includes("delete")
    ),
    "4": [ // Operations Manager
      "dashboard_view",
      "orders_view_list", "orders_view_detail", "orders_update_status", "orders_update_shipping",
      "products_view", "products_create", "products_edit", "products_update_stock",
      "categories_view", "categories_create", "categories_edit",
      "bundles_view", "bundles_create", "bundles_edit",
      "solar_view_list", "solar_enable", "solar_disable",
      "carousel_view", "carousel_create", "carousel_edit", "carousel_delete",
      "blog_view", "blog_create", "blog_edit", "blog_publish",
    ],
    "5": [ // Finance Officer
      "dashboard_view",
      "orders_view_list", "orders_view_detail",
      "credit_view_list", "credit_view_detail", "credit_update_status",
      "payment_schedules_view", "payment_schedules_mark_paid",
      "products_view",
    ],
    "6": [ // Support Staff
      "dashboard_view",
      "orders_view_list", "orders_view_detail",
      "credit_view_list", "credit_view_detail",
      "users_view_list", "users_view_detail",
    ],
  };
  
  return rolePermissionsMap[roleId] || [];
};