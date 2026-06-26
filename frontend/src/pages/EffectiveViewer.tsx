import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { User, PermissionMatrix } from '../types/rbac';
import { apiService } from '../services/api';
import { PermissionMatrixTable } from '../components/PermissionMatrixTable';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { UserCheck, ShieldCheck, HelpCircle, User as UserIcon } from 'lucide-react';

export const EffectiveViewer: React.FC = () => {
  const { users, isLoading } = useApp();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [effectivePermissions, setEffectivePermissions] = useState<PermissionMatrix | null>(null);
  const [isFetchingPermissions, setIsFetchingPermissions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedUser = users.find(u => u.id === selectedUserId) || null;

  // Fetch effective permissions when selected user changes
  useEffect(() => {
    if (selectedUserId) {
      setIsFetchingPermissions(true);
      setError(null);
      apiService
        .getEffectivePermissions(selectedUserId)
        .then(perms => {
          setEffectivePermissions(perms);
        })
        .catch(err => {
          setError(err.message || 'Failed to fetch effective permissions');
          setEffectivePermissions(null);
        })
        .finally(() => {
          setIsFetchingPermissions(false);
        });
    } else {
      setEffectivePermissions(null);
    }
  }, [selectedUserId, users]); // Trigger on users list update too (roles reload)

  // Pre-select first user if none is selected
  useEffect(() => {
    if (users.length > 0 && !selectedUserId) {
      setSelectedUserId(users[0].id);
    }
  }, [users, selectedUserId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-4"></div>
        <LoadingSkeleton type="matrix" />
      </div>
    );
  }

  // Compile list of flat permissions for the table component
  const flatPermissionsList: string[] = [];
  if (effectivePermissions) {
    Object.entries(effectivePermissions).forEach(([resource, actions]) => {
      actions.forEach(action => {
        flatPermissionsList.push(`${resource}:${action}`);
      });
    });
  }

  // Helper to trace which roles granted a specific permission
  const getGrantingRoles = (permString: string): string[] => {
    if (!selectedUser) return [];
    return selectedUser.roles
      .filter(role => role.permissions.includes(permString))
      .map(role => role.name);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-150 dark:border-slate-850/40 pb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Effective Permissions Viewer
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Trace and analyze a user's resolved access rights. See exactly which roles granted each privilege.
        </p>
      </div>

      {/* Selector and User Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selector */}
        <div className="lg:col-span-1 glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl p-6 h-fit">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Select Team Member
          </label>
          <div className="relative">
            <select
              value={selectedUserId}
              onChange={e => setSelectedUserId(e.target.value)}
              className="block w-full px-4 py-2.5 bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-workbench-500/20 focus:border-workbench-500 transition-all cursor-pointer"
            >
              <option value="" disabled>Select user...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <div className="mt-6 pt-6 border-t border-slate-150 dark:border-slate-800/40 space-y-4">
              <div className="flex items-center gap-3">
                {selectedUser.avatarUrl ? (
                  <img
                    src={selectedUser.avatarUrl}
                    alt={selectedUser.name}
                    className="h-12 w-12 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-2xl bg-workbench-50 dark:bg-workbench-950 flex items-center justify-center text-workbench-600 dark:text-workbench-450">
                    <UserIcon className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-150">
                    {selectedUser.name}
                  </h4>
                  <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-0.5">{selectedUser.email}</p>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Assigned Roles ({selectedUser.roles.length})
                </div>
                {selectedUser.roles.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-600 italic">No roles assigned.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUser.roles.map(role => (
                      <span
                        key={role.id}
                        className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold border
                          ${role.isSystem 
                            ? 'bg-workbench-50/50 dark:bg-workbench-950/20 border-workbench-100 dark:border-workbench-900/20 text-workbench-750 dark:text-workbench-400' 
                            : 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/20 text-purple-750 dark:text-purple-400'
                          }`}
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Trace Explanation Panel */}
        <div className="lg:col-span-2 glass-panel border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-workbench-600 dark:text-workbench-450">
              <ShieldCheck className="h-6 w-6" />
              <h3 className="text-base font-bold">Trace Audit Explanation</h3>
            </div>
            
            {!selectedUser ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">Select a user to display their permission log trace.</p>
            ) : selectedUser.roles.length === 0 ? (
              <div className="bg-amber-50/50 dark:bg-amber-950/15 border border-amber-100 dark:border-amber-900/35 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                This user has no roles assigned. Their net effective permissions are completely empty. They cannot view or manage any system resources.
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
                  The grid to the right illustrates the active capabilities for <strong>{selectedUser.name}</strong>. Here is the list of active permissions and the roles that authorize them:
                </p>
                <div className="max-h-[220px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850/30 pr-2 border border-slate-100 dark:border-slate-850/50 rounded-xl p-3 bg-slate-50/30 dark:bg-[#121526]/10">
                  {flatPermissionsList.map(perm => {
                    const [res, act] = perm.split(':');
                    const sources = getGrantingRoles(perm);

                    return (
                      <div key={perm} className="py-2 flex items-center justify-between text-xs gap-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-200 capitalize">
                            {res} &raquo; {act.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 items-center justify-end">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mr-1">granted by:</span>
                          {sources.map(s => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-850/40 text-[11px] text-slate-400 dark:text-slate-500">
            <HelpCircle className="h-4 w-4 text-workbench-500" />
            <span>Net permissions are evaluated in real-time as a mathematical union of all roles.</span>
          </div>
        </div>
      </div>

      {/* Permission Grid Table */}
      {isFetchingPermissions ? (
        <LoadingSkeleton type="matrix" />
      ) : error ? (
        <div className="p-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 rounded-2xl text-sm">
          {error}
        </div>
      ) : selectedUser && effectivePermissions ? (
        <PermissionMatrixTable
          permissions={flatPermissionsList}
          title="Net Resolved Permission Grid"
          subtitle={`Calculated active authorizations for ${selectedUser.name} based on assigned roles.`}
        />
      ) : null}
    </div>
  );
};
export default EffectiveViewer;
