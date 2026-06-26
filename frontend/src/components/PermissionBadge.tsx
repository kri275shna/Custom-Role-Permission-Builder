import React from 'react';

interface PermissionBadgeProps {
  permission: string; // "resource:action"
  showResource?: boolean;
}

export const PermissionBadge: React.FC<PermissionBadgeProps> = ({ permission, showResource = true }) => {
  const [resource, action] = permission.split(':');
  
  // Format the action name for display
  const displayAction = action ? action.replace('_', ' ') : permission;

  // Decide colors based on resource category
  let colorClass = 'bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/40';

  if (resource === 'projects') {
    colorClass = 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/20';
  } else if (resource === 'tasks') {
    colorClass = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20';
  } else if (resource === 'members') {
    colorClass = 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/20';
  } else if (resource === 'billing') {
    colorClass = 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/20';
  } else if (resource === 'settings') {
    colorClass = 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-900/20';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-medium ${colorClass}`}>
      {showResource && (
        <span className="opacity-60 text-[10px] uppercase font-bold tracking-wider mr-0.5 border-r pr-1 border-current">
          {resource}
        </span>
      )}
      <span className="capitalize">{displayAction}</span>
    </span>
  );
};
export default PermissionBadge;
