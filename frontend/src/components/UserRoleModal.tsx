import React, { useState, useEffect } from 'react';
import { User, Role } from '../types/rbac';
import { useApp } from '../store/AppContext';
import { X, Shield, Check } from 'lucide-react';

interface UserRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserRoleModal: React.FC<UserRoleModalProps> = ({ isOpen, onClose, user }) => {
  const { roles, assignRole, removeRole } = useApp();
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize selected role ids from user roles
  useEffect(() => {
    if (isOpen && user) {
      setSelectedRoleIds(user.roles.map(r => r.id));
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleToggleRole = (roleId: string) => {
    setSelectedRoleIds(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const initialRoleIds = user.roles.map(r => r.id);
    const addedRoleIds = selectedRoleIds.filter(id => !initialRoleIds.includes(id));
    const removedRoleIds = initialRoleIds.filter(id => !selectedRoleIds.includes(id));

    try {
      // Execute all additions
      for (const id of addedRoleIds) {
        await assignRole(user.id, id);
      }
      
      // Execute all removals
      for (const id of removedRoleIds) {
        await removeRole(user.id, id);
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to update user roles', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-[#111425] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-slide-up flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-150 dark:border-slate-800/40 flex justify-between items-center bg-slate-50/50 dark:bg-[#121526]/50">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Manage User Roles
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select which role profiles are assigned to **{user.name}**.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Roles List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          <div className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-2">
            Available Roles ({roles.length})
          </div>

          {roles.map(role => {
            const isAssigned = selectedRoleIds.includes(role.id);

            return (
              <div
                key={role.id}
                onClick={() => handleToggleRole(role.id)}
                className={`p-4 rounded-xl border flex items-start gap-4 cursor-pointer select-none transition-all duration-200
                  ${isAssigned 
                    ? 'bg-workbench-50/60 dark:bg-workbench-950/20 border-workbench-200 dark:border-workbench-900/40 shadow-sm' 
                    : 'bg-white dark:bg-[#121526] border-slate-150 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850/30'
                  }`}
              >
                {/* Checkbox indicator */}
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-all
                      ${isAssigned 
                        ? 'bg-workbench-600 border-workbench-600 text-white' 
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                  >
                    {isAssigned && <Check className="h-3 w-3 stroke-[3px]" />}
                  </div>
                </div>

                {/* Role Details */}
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                      {role.name}
                    </span>
                    {role.isSystem && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-850/10">
                        System
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-450 dark:text-slate-400 mt-1 line-clamp-2">
                    {role.description || 'No description provided.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-150 dark:border-slate-800/40 flex justify-end gap-3 bg-slate-50/50 dark:bg-[#121526]/50">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-750 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-workbench-600 to-workbench-500 hover:from-workbench-500 hover:to-workbench-400 disabled:opacity-50 rounded-xl shadow-lg shadow-workbench-500/25 transition-all"
          >
            {isSaving ? 'Saving...' : 'Save Assignments'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default UserRoleModal;
