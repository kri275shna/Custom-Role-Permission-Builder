import React from 'react';
import { useApp } from '../store/AppContext';
import { Shield, ShieldCheck, Users, Info, Settings, ArrowRight } from 'lucide-react';
import LoadingSkeleton from '../components/LoadingSkeleton';

export const Dashboard: React.FC = () => {
  const { roles, users, isLoading, setActivePage } = useApp();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-4"></div>
        <LoadingSkeleton type="dashboard" />
      </div>
    );
  }

  const systemRolesCount = roles.filter(r => r.isSystem).length;
  const customRolesCount = roles.filter(r => !r.isSystem).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Workbench Admin Center
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Welcome to the Workbench Role-Based Access Control configuration dashboard.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center justify-between border border-slate-200/60 dark:border-slate-850/40">
          <div>
            <span className="text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider block">
              Active Users
            </span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2 block">
              {users.length}
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between border border-slate-200/60 dark:border-slate-850/40">
          <div>
            <span className="text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider block">
              System Roles
            </span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2 block">
              {systemRolesCount}
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-workbench-50 dark:bg-workbench-950/20 text-workbench-500 flex items-center justify-center">
            <Shield className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between border border-slate-200/60 dark:border-slate-850/40">
          <div>
            <span className="text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider block">
              Custom Roles
            </span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2 block">
              {customRolesCount}
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-950/20 text-purple-500 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Algorithm Summary */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 text-workbench-600 dark:text-workbench-450 mb-4">
            <Info className="h-6 w-6" />
            <h3 className="text-lg font-bold">Union-Based Permission Merger</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
            Workbench utilizes a deterministic <strong>Union-Based</strong> permission merger. When a user holds multiple overlapping roles, their net permissions are calculated as the mathematical union of all permissions associated with their assigned roles. 
          </p>
          <div className="bg-slate-50 dark:bg-[#121526] border border-slate-200/40 dark:border-slate-800/40 rounded-xl p-4 mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-medium text-slate-650 dark:text-slate-400">
              <span>Time Complexity:</span>
              <span className="font-mono text-workbench-500">O(R × P)</span>
            </div>
            <div className="flex justify-between items-center text-xs font-medium text-slate-650 dark:text-slate-400">
              <span>Space Complexity:</span>
              <span className="font-mono text-workbench-500">O(P_total)</span>
            </div>
            <div className="flex justify-between items-center text-xs font-medium text-slate-650 dark:text-slate-400">
              <span>Overlap Resolution:</span>
              <span className="font-mono text-emerald-500">Duplicate Removal</span>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-purple-500 mb-4">
              <Settings className="h-6 w-6" />
              <h3 className="text-lg font-bold">Configuration Workflows</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed mb-6">
              Create and adjust access templates to match contractor, lead, or support profiles, then attach them to user cards in-place.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setActivePage('roles')}
              className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-[#13162a]/50 dark:hover:bg-[#191d37]/50 border border-slate-250/20 dark:border-slate-800/40 rounded-xl transition-all font-semibold text-sm group"
            >
              <span>Build Custom Roles</span>
              <ArrowRight className="h-4 w-4 text-workbench-500 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setActivePage('users')}
              className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-[#13162a]/50 dark:hover:bg-[#191d37]/50 border border-slate-250/20 dark:border-slate-800/40 rounded-xl transition-all font-semibold text-sm group"
            >
              <span>Manage Team Role Assignments</span>
              <ArrowRight className="h-4 w-4 text-workbench-500 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
