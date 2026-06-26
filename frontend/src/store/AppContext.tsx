import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role, User, PermissionMatrix } from '../types/rbac';
import { apiService } from '../services/api';

export type ActivePage = 'dashboard' | 'roles' | 'users' | 'effective-viewer';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  // Data State
  permissions: PermissionMatrix | null;
  roles: Role[];
  users: User[];
  isLoading: boolean;
  error: string | null;

  // Active view
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;

  // Notifications State
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Theme State
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Sync operations
  refreshData: () => Promise<void>;
  createRole: (role: Omit<Role, 'id' | 'isSystem'>) => Promise<void>;
  updateRole: (id: string, role: Partial<Omit<Role, 'id' | 'isSystem'>>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  assignRole: (userId: string, roleId: string) => Promise<void>;
  removeRole: (userId: string, roleId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [permissions, setPermissions] = useState<PermissionMatrix | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(true); // Default to Dark Mode for premium aesthetics

  // Toast Management
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    
    // Auto-remove toast after 4s
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Dark Mode Sync
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      return next;
    });
  };

  // Sync Data with Backend
  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [permData, roleData, userData] = await Promise.all([
        apiService.getPermissions(),
        apiService.getRoles(),
        apiService.getUsers()
      ]);
      setPermissions(permData);
      setRoles(roleData);
      setUsers(userData);
    } catch (err: any) {
      setError(err.message || 'Failed to sync data with server');
      showToast('Error syncing data with server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data and apply theme
  useEffect(() => {
    refreshData();
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  // CRUD Wrapper Operations
  const handleCreateRole = async (roleData: Omit<Role, 'id' | 'isSystem'>) => {
    try {
      await apiService.createRole(roleData);
      showToast(`Role "${roleData.name}" created successfully`, 'success');
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to create role', 'error');
      throw err;
    }
  };

  const handleUpdateRole = async (id: string, roleData: Partial<Omit<Role, 'id' | 'isSystem'>>) => {
    try {
      await apiService.updateRole(id, roleData);
      showToast('Role updated successfully', 'success');
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update role', 'error');
      throw err;
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      const targetRole = roles.find(r => r.id === id);
      await apiService.deleteRole(id);
      showToast(`Role "${targetRole?.name}" deleted successfully`, 'success');
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete role', 'error');
      throw err;
    }
  };

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      await apiService.assignRole(userId, roleId);
      const user = users.find(u => u.id === userId);
      const role = roles.find(r => r.id === roleId);
      showToast(`Assigned ${role?.name} role to ${user?.name}`, 'success');
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to assign role', 'error');
      throw err;
    }
  };

  const handleRemoveRole = async (userId: string, roleId: string) => {
    try {
      await apiService.removeRole(userId, roleId);
      const user = users.find(u => u.id === userId);
      const role = roles.find(r => r.id === roleId);
      showToast(`Removed ${role?.name} role from ${user?.name}`, 'success');
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove role', 'error');
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        permissions,
        roles,
        users,
        isLoading,
        error,
        activePage,
        setActivePage,
        toasts,
        showToast,
        removeToast,
        darkMode,
        toggleDarkMode,
        refreshData,
        createRole: handleCreateRole,
        updateRole: handleUpdateRole,
        deleteRole: handleDeleteRole,
        assignRole: handleAssignRole,
        removeRole: handleRemoveRole
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
