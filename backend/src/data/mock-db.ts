import { User, Role, UserRole } from '../models/types';

// The system MUST use exactly the following permissions
export const SYSTEM_PERMISSIONS = {
  projects: ['view', 'create', 'edit', 'delete', 'archive'],
  tasks: ['view', 'create', 'edit', 'delete', 'assign'],
  members: ['view', 'invite', 'remove', 'update_role'],
  billing: ['view', 'update', 'download_invoices'],
  settings: ['view', 'update']
};

export const ALL_PERMISSIONS_FLAT: string[] = Object.entries(SYSTEM_PERMISSIONS).reduce<string[]>(
  (acc, [resource, actions]) => {
    actions.forEach(action => acc.push(`${resource}:${action}`));
    return acc;
  },
  []
);

export let mockRoles: Role[] = [
  {
    id: 'role-owner',
    name: 'Owner',
    description: 'Full organization ownership. Access to billing, settings, and role management.',
    permissions: [...ALL_PERMISSIONS_FLAT], // All permissions
    isSystem: true
  },
  {
    id: 'role-admin',
    name: 'Admin',
    description: 'Administrative access for project management and team invitation.',
    permissions: [
      'projects:view', 'projects:create', 'projects:edit', 'projects:archive',
      'tasks:view', 'tasks:create', 'tasks:edit', 'tasks:delete', 'tasks:assign',
      'members:view', 'members:invite', 'members:update_role',
      'settings:view', 'settings:update'
    ],
    isSystem: true
  },
  {
    id: 'role-member',
    name: 'Member',
    description: 'Standard member role. Can read and write projects and tasks.',
    permissions: [
      'projects:view',
      'tasks:view', 'tasks:create', 'tasks:edit', 'tasks:assign',
      'members:view'
    ],
    isSystem: true
  },
  {
    id: 'role-viewer',
    name: 'Viewer',
    description: 'Read-only access across projects, tasks, and settings.',
    permissions: [
      'projects:view',
      'tasks:view',
      'members:view',
      'billing:view',
      'settings:view'
    ],
    isSystem: true
  }
];

export let mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alice Johnson',
    email: 'alice.johnson@workbench.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'user-2',
    name: 'Bob Smith',
    email: 'bob.smith@workbench.com',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'user-3',
    name: 'Charlie Brown',
    email: 'charlie.brown@workbench.com',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'user-4',
    name: 'Diana Prince',
    email: 'diana.prince@workbench.com',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
  }
];

export let mockUserRoles: UserRole[] = [
  { id: 'ur-1', userId: 'user-1', roleId: 'role-owner' },
  { id: 'ur-2', userId: 'user-2', roleId: 'role-admin' },
  // Charlie has multiple overlapping roles: Member + Viewer
  { id: 'ur-3', userId: 'user-3', roleId: 'role-member' },
  { id: 'ur-4', userId: 'user-3', roleId: 'role-viewer' },
  { id: 'ur-5', userId: 'user-4', roleId: 'role-viewer' }
];
