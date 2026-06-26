import React from 'react';
import { useApp } from '../store/AppContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0">
      {toasts.map(toast => {
        let icon = <Info className="h-5 w-5 text-blue-500" />;
        let bgClass = 'bg-white border-blue-100 dark:bg-slate-900 dark:border-blue-900/40';
        
        if (toast.type === 'success') {
          icon = <CheckCircle className="h-5 w-5 text-emerald-500" />;
          bgClass = 'bg-white border-emerald-100 dark:bg-slate-900 dark:border-emerald-900/40';
        } else if (toast.type === 'error') {
          icon = <XCircle className="h-5 w-5 text-rose-500" />;
          bgClass = 'bg-white border-rose-100 dark:bg-slate-900 dark:border-rose-900/40';
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl animate-slide-up ${bgClass} transition-all duration-300`}
          >
            <div className="flex-shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors p-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
export default ToastContainer;
