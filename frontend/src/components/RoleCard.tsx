import React, { useState } from 'react';
import { Role } from '../types/rbac';
import { RoleBadge } from './RoleBadge';
import { PermissionBadge } from './PermissionBadge';
import { Edit3, Trash2, Copy, Shield, ChevronDown, ChevronUp } from 'lucide-react';

interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onClone: (role: Role) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, onEdit, onDelete, onClone }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_VISIBLE_BADGES = 6;
  const hasMorePermissions = role.permissions.length > MAX_VISIBLE_BADGES;
  
  const visiblePermissions = isExpanded 
    ? role.permissions 
    : role.permissions.slice(0, MAX_VISIBLE_BADGES);

  return (
    <div className="glass-card flex flex-col justify-between h-full p-6 transition-all duration-300">
      {/* Header */}
      <div>
        <div className="flex justify-between items-start gap-4 mb-3">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
            {role.name}
          </h4>
          <RoleBadge name={role.isSystem ? 'System' : 'Custom'} isSystem={role.isSystem} />
        </div>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[32px] mb-4">
          {role.description || 'No description provided.'}
        </p>
      </div>

      {/* Permissions Grid */}
      <div className="flex-1 mb-5">
        <div className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-2">
          Granted Permissions ({role.permissions.length})
        </div>
        
        {role.permissions.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-650 italic">No permissions assigned.</p>
        ) : (
          <div className="flex flex-wrap gap-1.5 transition-all">
            {visiblePermissions.map(perm => (
              <PermissionBadge key={perm} permission={perm} />
            ))}
            
            {hasMorePermissions && !isExpanded && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800/40">
                +{role.permissions.length - MAX_VISIBLE_BADGES} more
              </span>
            )}
          </div>
        )}

        {hasMorePermissions && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[10px] font-semibold text-workbench-500 hover:text-workbench-600 dark:text-workbench-450 mt-3 focus:outline-none"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Show All <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-850/40 mt-auto">
        <button
          onClick={() => onClone(role)}
          title="Clone Role Template"
          className="p-2 text-slate-450 hover:text-slate-600 dark:hover:text-slate-350 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-center gap-1 text-xs font-medium"
        >
          <Copy className="h-3.5 w-3.5" />
          <span>Clone</span>
        </button>

        <div className="flex gap-1.5">
          {role.isSystem ? (
            <div className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 dark:text-slate-600 font-medium select-none bg-slate-50 dark:bg-slate-850/20 border border-slate-150/40 dark:border-slate-850/10 rounded-xl">
              <Shield className="h-3.5 w-3.5" />
              <span>Locked</span>
            </div>
          ) : (
            <>
              <button
                onClick={() => onEdit(role)}
                title="Edit Role"
                className="p-2 text-slate-500 hover:text-workbench-600 dark:hover:text-workbench-400 rounded-xl hover:bg-workbench-50/50 dark:hover:bg-[#121526]/50 transition-all"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(role)}
                title="Delete Role"
                className="p-2 text-slate-500 hover:text-rose-500 dark:hover:text-rose-450 rounded-xl hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default RoleCard;
