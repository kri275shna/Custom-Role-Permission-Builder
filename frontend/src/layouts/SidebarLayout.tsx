import React from 'react';
import { useApp, ActivePage } from '../store/AppContext';
import { LayoutDashboard, Shield, Users, Eye, Moon, Sun, ShieldCheck } from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const { activePage, setActivePage, darkMode, toggleDarkMode } = useApp();

  const navigationItems = [
    {
      id: 'dashboard' as ActivePage,
      label: 'Overview',
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      id: 'roles' as ActivePage,
      label: 'Roles & Permissions',
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: 'users' as ActivePage,
      label: 'User Directory',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 'effective-viewer' as ActivePage,
      label: 'Effective Permissions',
      icon: <Eye className="h-4 w-4" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-[#0b0c15] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-[#101222] border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-850/65 flex flex-col flex-shrink-0">
        {/* Brand logo */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-150 dark:border-slate-850/60">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-workbench-600 to-workbench-400 text-white flex items-center justify-center font-bold text-base shadow-md shadow-workbench-500/20">
            W
          </div>
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100">
            Workbench RBAC
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navigationItems.map(item => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-workbench-500 hover:bg-workbench-600 text-white shadow-lg shadow-workbench-500/10'
                    : 'text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850/45 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer (Theme toggle) */}
        <div className="p-4 border-t border-slate-150 dark:border-slate-850/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-slate-500 dark:text-slate-400 text-[10px] font-bold">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate w-32">
                System Admin
              </p>
              <p className="text-[10px] text-slate-450 dark:text-slate-500 truncate w-32">
                admin@workbench.io
              </p>
            </div>
          </div>
          
          <button
            onClick={toggleDarkMode}
            title="Toggle theme"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850/50 transition-colors"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* Main content slot */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header navbar */}
        <header className="h-16 bg-white dark:bg-[#101222]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-850/60 flex items-center justify-between px-6 md:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-450 dark:text-slate-500 tracking-wide uppercase">
              Control Panel
            </span>
            <span className="text-slate-300 dark:text-slate-800">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-350 capitalize">
              {activePage.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-450 text-[10px] font-bold rounded-lg shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Session Connected</span>
            </div>
          </div>
        </header>

        {/* Page Content viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
export default SidebarLayout;
