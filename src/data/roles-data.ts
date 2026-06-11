import { Role, RoleStats } from "@/types/admin-role";

export const dummyRoles: Role[] = [
  {
    id: "1",
    name: "Admin",
    description: "Full access to all admin panel resources and settings",
    permissionsCount: 67,
    usersCount: 2,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Customer",
    description: "Access limited to own orders, credit accounts, solar systems, and public content",
    permissionsCount: 15,
    usersCount: 9,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Viewer",
    description: "Read-only access across all admin-visible resources — no create, edit, delete, or control actions",
    permissionsCount: 26,
    usersCount: 5,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Operations Manager",
    description: "Manages orders, products, solar systems, and carousel content",
    permissionsCount: 41,
    usersCount: 3,
    createdAt: "2024-02-05T00:00:00.000Z",
    updatedAt: "2024-02-05T00:00:00.000Z",
  },
  {
    id: "5",
    name: "Finance Officer",
    description: "Access to credit accounts, payment records, and revenue data",
    permissionsCount: 16,
    usersCount: 2,
    createdAt: "2024-02-20T00:00:00.000Z",
    updatedAt: "2024-02-20T00:00:00.000Z",
  },
  {
    id: "6",
    name: "Support Staff",
    description: "Read-only access to users, orders, and credit accounts for customer support",
    permissionsCount: 13,
    usersCount: 8,
    createdAt: "2024-03-01T00:00:00.000Z",
    updatedAt: "2024-03-01T00:00:00.000Z",
  },
];

export const dummyStats: RoleStats = {
  totalRoles: 6,
  totalPermissions: 178,
  totalUsers: 29,
  totalRolesWithUsers: 6,
};