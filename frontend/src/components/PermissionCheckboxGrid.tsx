import React from 'react';
import { SYSTEM_PERMISSIONS_MATRIX, RESOURCE_DISPLAY_NAMES } from '../constants/permissions';

interface PermissionCheckboxGridProps {
  selectedPermissions: string[];
  onChange: (permissions: string[]) => void;
  disabled?: boolean;
}

export const PermissionCheckboxGrid: React.FC<PermissionCheckboxGridProps> = ({
  selectedPermissions,
  onChange,
  disabled = false
}) => {
  const handleToggle = (perm: string) => {
    if (disabled) return;
    if (selectedPermissions.includes(perm)) {
      onChange(selectedPermissions.filter(p => p !== perm));
    } else {
      onChange([...selectedPermissions, perm]);
    }
  };

  const handleToggleResource = (resource: string, actions: string[]) => {
    if (disabled) return;
    const resourcePerms = actions.map(act => `${resource}:${act}`);
    const allSelected = resourcePerms.every(p => selectedPermissions.includes(p));

    if (allSelected) {
      // Remove all for this resource
      onChange(selectedPermissions.filter(p => !resourcePerms.includes(p)));
    } else {
      // Add missing ones
      const nextPerms = [...selectedPermissions];
      resourcePerms.forEach(p => {
        if (!nextPerms.includes(p)) {
          nextPerms.push(p);
        }
      });
      onChange(nextPerms);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
        Permissions Matrix
      </div>
      <div className="border border-slate-100 dark:border-slate-800/60 rounded-xl overflow-hidden divide-y divide-slate-150 dark:divide-slate-800/40">
        {Object.entries(SYSTEM_PERMISSIONS_MATRIX).map(([resource, actions]) => {
          const resourcePerms = actions.map(act => `${resource}:${act}`);
          const allSelected = resourcePerms.every(p => selectedPermissions.includes(p));
          const someSelected = resourcePerms.some(p => selectedPermissions.includes(p)) && !allSelected;

          return (
            <div
              key={resource}
              className="p-4 bg-slate-50/30 dark:bg-[#121526]/20 grid grid-cols-1 md:grid-cols-4 gap-4 items-start"
            >
              {/* Row title & Toggle All */}
              <div className="md:col-span-1">
                <label className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-200 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={el => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    disabled={disabled}
                    onChange={() => handleToggleResource(resource, actions)}
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-800 text-workbench-600 focus:ring-workbench-500/25 transition-all"
                  />
                  <span>{RESOURCE_DISPLAY_NAMES[resource] || resource}</span>
                </label>
              </div>

              {/* Action checkboxes */}
              <div className="md:col-span-3 flex flex-wrap gap-4">
                {actions.map(action => {
                  const perm = `${resource}:${action}`;
                  const isChecked = selectedPermissions.includes(perm);

                  return (
                    <label
                      key={action}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs cursor-pointer select-none transition-all duration-200
                        ${isChecked 
                          ? 'bg-workbench-50/80 dark:bg-workbench-950/20 border-workbench-200 dark:border-workbench-900/40 text-workbench-700 dark:text-workbench-400 font-semibold' 
                          : 'bg-white dark:bg-[#121526] border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={disabled}
                        onChange={() => handleToggle(perm)}
                        className="h-3.5 w-3.5 rounded border-slate-350 dark:border-slate-800 text-workbench-600 focus:ring-workbench-500/25 transition-all"
                      />
                      <span className="capitalize">{action.replace('_', ' ')}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default PermissionCheckboxGrid;
