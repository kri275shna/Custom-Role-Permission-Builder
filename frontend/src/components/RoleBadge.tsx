import React from 'react';

interface RoleBadgeProps {
  name: string;
  isSystem?: boolean;
  onClick?: () => void;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ name, isSystem = false, onClick }) => {
  const baseClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none transition-all";
  
  const systemClass = "bg-workbench-50 dark:bg-workbench-950/40 text-workbench-700 dark:text-workbench-400 border border-workbench-100 dark:border-workbench-900/30";
  const customClass = "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30";

  return (
    <span
      onClick={onClick}
      className={`${baseClass} ${isSystem ? systemClass : customClass} ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}`}
    >
      {name}
    </span>
  );
};
export default RoleBadge;
