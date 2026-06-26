export interface Permission {
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // "resource:action" strings
  isSystem: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roles: Role[]; // Nested list of resolved roles
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
}

export type PermissionMatrix = Record<string, string[]>;
