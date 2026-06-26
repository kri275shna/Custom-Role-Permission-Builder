import React from 'react';

interface SkeletonProps {
  type?: 'card' | 'table' | 'dashboard' | 'matrix';
}

export const LoadingSkeleton: React.FC<SkeletonProps> = ({ type = 'card' }) => {
  if (type === 'dashboard') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div className="h-4 bg-slate-350 dark:bg-slate-700 w-1/3 rounded"></div>
            <div className="h-8 bg-slate-350 dark:bg-slate-700 w-1/2 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full bg-white dark:bg-[#101222]/80 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 w-1/4 rounded"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-700 w-1/3 rounded"></div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-2/3"></div>
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/3"></div>
          </div>
          {[1, 2, 3, 4].map(row => (
            <div key={row} className="grid grid-cols-4 gap-4 py-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'matrix') {
    return (
      <div className="w-full bg-white dark:bg-[#101222]/80 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 w-1/3 rounded mb-8"></div>
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map(row => (
            <div key={row} className="flex items-center gap-6">
              <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-24"></div>
              <div className="flex-1 flex gap-4">
                {[1, 2, 3, 4, 5].map(col => (
                  <div key={col} className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-12"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: Card grid loader
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map(card => (
        <div
          key={card}
          className="bg-white dark:bg-[#101222]/80 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 h-64 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="h-6 bg-slate-300 dark:bg-slate-700 w-1/2 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 w-3/4 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 w-5/6 rounded"></div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3].map(b => (
              <div key={b} className="h-6 bg-slate-200 dark:bg-slate-800 w-16 rounded-full"></div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/40">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 w-16 rounded-lg"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 w-16 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default LoadingSkeleton;
