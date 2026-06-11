import { User } from "@/types/admin-role";
import { dummyRoles } from "./roles-data";

export const dummyUsers: User[] = [
  {
    id: "1",
    name: "John Mensah",
    email: "john.mensah@power8.com",
    phone: "+233 20 123 4567",
    roles: [dummyRoles[0]], // Admin role
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@power8.com",
    phone: "+233 20 123 4568",
    roles: [dummyRoles[3], dummyRoles[4]], // Operations Manager + Finance Officer
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@power8.com",
    phone: "+233 20 123 4569",
    roles: [dummyRoles[5]], // Support Staff
    createdAt: "2024-02-01T00:00:00.000Z",
    updatedAt: "2024-02-01T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@power8.com",
    phone: "+233 20 123 4570",
    roles: [], // No roles
    createdAt: "2024-02-15T00:00:00.000Z",
    updatedAt: "2024-02-15T00:00:00.000Z",
  },
];