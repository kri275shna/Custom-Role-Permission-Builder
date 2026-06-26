import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChangeValue: (val: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeValue,
  placeholder = 'Search...',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative w-full max-w-xs ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChangeValue(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-[#121526] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-workbench-500/25 focus:border-workbench-500 transition-all"
        {...props}
      />
    </div>
  );
};
export default SearchInput;
