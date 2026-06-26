import React, { useState, useEffect } from 'react';
import { Role } from '../types/rbac';
import { useApp } from '../store/AppContext';
import { PermissionCheckboxGrid } from './PermissionCheckboxGrid';
import { X, ShieldAlert } from 'lucide-react';
import { z } from 'zod';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleToEdit?: Role | null; // Null means create mode
}

// Zod schema for browser-side validation feedback
const roleFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Role name must be at least 3 characters long' })
    .max(50, { message: 'Role name cannot exceed 50 characters' })
    .regex(/^[a-zA-Z0-9\s-_]+$/, {
      message: 'Role name can only contain letters, numbers, spaces, hyphens, and underscores'
    }),
  description: z.string().max(200, { message: 'Description cannot exceed 200 characters' }),
  permissions: z.array(z.string())
});

export const RoleFormModal: React.FC<RoleFormModalProps> = ({ isOpen, onClose, roleToEdit }) => {
  const { createRole, updateRole, roles } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!roleToEdit;

  // Initialize fields when roleToEdit changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (roleToEdit) {
        setName(roleToEdit.name);
        setDescription(roleToEdit.description);
        setSelectedPermissions(roleToEdit.permissions);
      } else {
        setName('');
        setDescription('');
        setSelectedPermissions([]);
      }
      setErrors({});
    }
  }, [isOpen, roleToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      permissions: selectedPermissions
    };

    // Client-side schema validation
    const result = roleFormSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(err => {
        const path = err.path[0] as string;
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // Check for duplicate names on client side (except if editing and name didn't change)
    const isDuplicate = roles.some(
      r =>
        r.name.toLowerCase() === payload.name.toLowerCase() &&
        (!isEditMode || r.id !== roleToEdit?.id)
    );
    if (isDuplicate) {
      setErrors({ name: `A role with name "${payload.name}" already exists` });
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditMode && roleToEdit) {
        await updateRole(roleToEdit.id, payload);
      } else {
        await createRole(payload);
      }
      onClose();
    } catch (err: any) {
      // Backend error was already toasted, bind error state if specific
      setErrors({ global: err.message || 'Operation failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-white dark:bg-[#111425] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 transform transition-all duration-300 animate-slide-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-150 dark:border-slate-800/40 flex justify-between items-center bg-slate-50/50 dark:bg-[#121526]/50">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {isEditMode ? 'Edit Custom Role' : 'Create Custom Role'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isEditMode
                ? `Update permissions configuration for the "${roleToEdit?.name}" role.`
                : 'Define a new custom role, specify its description, and select active permission privileges.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errors.global && (
            <div className="flex gap-2 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-450 rounded-xl text-sm font-semibold">
              <ShieldAlert className="h-5 w-5 flex-shrink-0" />
              <span>{errors.global}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Role Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g., Project Manager"
                  className={`block w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-[#121526] text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-workbench-500/20 transition-all
                    ${errors.name 
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/25' 
                      : 'border-slate-200 dark:border-slate-800 focus:border-workbench-500'
                    }`}
                />
                {errors.name && (
                  <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What operations does this role permit?"
                  rows={4}
                  className={`block w-full px-4 py-2.5 border rounded-xl bg-white dark:bg-[#121526] text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-workbench-500/20 transition-all resize-none
                    ${errors.description 
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/25' 
                      : 'border-slate-200 dark:border-slate-800 focus:border-workbench-500'
                    }`}
                />
                {errors.description && (
                  <p className="text-xs text-rose-500 mt-1.5 font-medium">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Permission Checkbox matrix */}
            <div className="md:col-span-2">
              <PermissionCheckboxGrid
                selectedPermissions={selectedPermissions}
                onChange={setSelectedPermissions}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-150 dark:border-slate-800/40 flex justify-end gap-3 bg-slate-50/50 dark:bg-[#121526]/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-workbench-600 to-workbench-500 hover:from-workbench-500 hover:to-workbench-400 disabled:opacity-50 rounded-xl shadow-lg shadow-workbench-500/25 transition-all"
          >
            {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Role'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default RoleFormModal;
