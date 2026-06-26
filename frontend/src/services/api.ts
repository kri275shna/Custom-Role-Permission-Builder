import { Role, User, PermissionMatrix } from '../types/rbac';

const API_BASE = 'http://localhost:5000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options?.headers || {})
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.message || `HTTP error! Status: ${response.status}`);
    }

    return json.data as T;
  } catch (error: any) {
    console.error(`[API ERROR] Path: ${path}`, error);
    throw new Error(error.message || 'Network communication error');
  }
}

export const apiService = {
  // Permissions
  getPermissions: () => request<PermissionMatrix>('/permissions'),

  // Roles
  getRoles: () => request<Role[]>('/roles'),
  createRole: (role: Omit<Role, 'id' | 'isSystem'>) =>
    request<Role>('/roles', {
      method: 'POST',
      body: JSON.stringify(role)
    }),
  updateRole: (id: string, role: Partial<Omit<Role, 'id' | 'isSystem'>>) =>
    request<Role>(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(role)
    }),
  deleteRole: (id: string) =>
    request<void>(`/roles/${id}`, {
      method: 'DELETE'
    }),

  // Users
  getUsers: () => request<User[]>('/users'),
  assignRole: (userId: string, roleId: string) =>
    request<void>(`/users/${userId}/roles`, {
      method: 'POST',
      body: JSON.stringify({ roleId })
    }),
  removeRole: (userId: string, roleId: string) =>
    request<void>(`/users/${userId}/roles/${roleId}`, {
      method: 'DELETE'
    }),
  getEffectivePermissions: (userId: string) =>
    request<PermissionMatrix>(`/users/${userId}/effective-permissions`)
};
export default apiService;
