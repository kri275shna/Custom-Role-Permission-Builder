import React from 'react';
import { User } from '../types/rbac';
import { RoleBadge } from './RoleBadge';
import { Users, Mail, Settings } from 'lucide-react';

interface UserCardProps {
  user: User;
  onManageRoles: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onManageRoles }) => {
  return (
    <div className="glass-card p-6 flex flex-col justify-between h-full hover:shadow-xl transition-all duration-300">
      <div>
        {/* Profile Info */}
        <div className="flex items-center gap-4 mb-4">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-12 w-12 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
            />
          ) : (
            <div className="h-12 w-12 rounded-2xl bg-workbench-100 dark:bg-workbench-950 flex items-center justify-center text-workbench-600 dark:text-workbench-450">
              <Users className="h-6 w-6" />
            </div>
          )}
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-150 truncate">
              {user.name}
            </h4>
            <div className="flex items-center gap-1 text-[11px] text-slate-450 dark:text-slate-400 mt-0.5 truncate">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>

        {/* Roles List */}
        <div className="space-y-2 min-h-[64px]">
          <div className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
            Assigned Roles ({user.roles.length})
          </div>
          {user.roles.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-650 italic">No roles assigned.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {user.roles.map(role => (
                <RoleBadge key={role.id} name={role.name} isSystem={role.isSystem} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer trigger */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-850/40 mt-5">
        <button
          onClick={() => onManageRoles(user)}
          className="w-full btn-secondary text-xs py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/40 dark:bg-slate-800/40 dark:hover:bg-slate-850/40 dark:border-slate-800/50 flex items-center justify-center gap-2"
        >
          <Settings className="h-3.5 w-3.5" />
          <span>Manage Roles</span>
        </button>
      </div>
    </div>
  );
};
export default UserCard;
