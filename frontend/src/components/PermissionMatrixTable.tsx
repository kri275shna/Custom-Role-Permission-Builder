import React from 'react';
import { SYSTEM_PERMISSIONS_MATRIX, RESOURCE_DISPLAY_NAMES } from '../constants/permissions';
import { Check, X } from 'lucide-react';

interface PermissionMatrixTableProps {
  permissions: string[]; // List of flat permissions: "resource:action"
  title?: string;
  subtitle?: string;
}

// Get the union list of all unique actions across all resources
const ALL_ACTIONS_COLUMNS = [
  'view',
  'create',
  'edit',
  'delete',
  'archive',
  'assign',
  'invite',
  'remove',
  'update_role',
  'update',
  'download_invoices'
];

export const PermissionMatrixTable: React.FC<PermissionMatrixTableProps> = ({
  permissions,
  title,
  subtitle
}) => {
  return (
    <div className="bg-white dark:bg-[#101222]/80 border border-slate-200 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-xl shadow-slate-100/10 dark:shadow-none">
      {/* Header */}
      {(title || subtitle) && (
        <div className="p-6 border-b border-slate-150 dark:border-slate-800/40">
          {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
      )}

      {/* Table grid wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-[#121526]/50 border-b border-slate-150 dark:border-slate-850/60">
              <th className="py-4 px-6 text-sm font-semibold text-slate-650 dark:text-slate-300 w-64">Resource</th>
              {ALL_ACTIONS_COLUMNS.map(action => (
                <th key={action} className="py-4 px-3 text-center text-xs font-semibold text-slate-650 dark:text-slate-300 capitalize min-w-[80px]">
                  {action.replace('_', ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-850/30">
            {Object.entries(SYSTEM_PERMISSIONS_MATRIX).map(([resource, actions]) => (
              <tr key={resource} className="hover:bg-slate-50/30 dark:hover:bg-[#13162b]/30 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-900 dark:text-slate-200 text-sm">
                  {RESOURCE_DISPLAY_NAMES[resource] || resource}
                </td>
                {ALL_ACTIONS_COLUMNS.map(action => {
                  const isSupported = actions.includes(action);
                  const permString = `${resource}:${action}`;
                  const isGranted = permissions.includes(permString);

                  return (
                    <td key={action} className="py-4 px-3 text-center">
                      {!isSupported ? (
                        <span className="text-[10px] text-slate-300 dark:text-slate-800 font-bold select-none">-</span>
                      ) : isGranted ? (
                        <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 dark:text-emerald-400">
                          <Check className="h-3.5 w-3.5 stroke-[3px]" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-50 dark:bg-slate-800/20 text-slate-350 dark:text-slate-700">
                          <X className="h-3 w-3 stroke-[2.5px]" />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PermissionMatrixTable;
