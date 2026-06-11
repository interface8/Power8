export type {
  PermissionDto,
  CreatePermissionInput,
  UpdatePermissionInput,
  PermissionGroupDto,
  ReplaceRolePermissionsInput,
} from "./types";
export { createPermissionSchema, updatePermissionSchema, replaceRolePermissionsSchema } from "./validation";
import * as permissionService from "./service";
export { permissionService };
export * as permissionRepository from "./repository";
