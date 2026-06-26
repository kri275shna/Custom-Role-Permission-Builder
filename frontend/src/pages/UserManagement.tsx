import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { User } from '../types/rbac';
import { UserCard } from '../components/UserCard';
import { SearchInput } from '../components/SearchInput';
import { UserRoleModal } from '../components/UserRoleModal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Users2, ShieldAlert } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { users, isLoading } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-4"></div>
        <LoadingSkeleton type="card" />
      </div>
    );
  }

  // Filter users by name or email search query
  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleManageRolesClick = (user: User) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header controls */}
      <div className="border-b border-slate-150 dark:border-slate-850/40 pb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          User Management
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Assign role templates to active team members and manage overlapping privileges.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between items-center bg-slate-50/50 dark:bg-[#121526]/50 p-4 border border-slate-150 dark:border-slate-800/40 rounded-2xl">
        <SearchInput
          value={searchQuery}
          onChangeValue={setSearchQuery}
          placeholder="Filter users by name or email..."
        />
        <div className="text-xs text-slate-450 dark:text-slate-400 font-medium">
          Showing {filteredUsers.length} of {users.length} Team Members
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#101222]/80 border border-slate-200 dark:border-slate-800/60 rounded-3xl text-center">
          <ShieldAlert className="h-12 w-12 text-slate-400 mb-4 stroke-[1.5px]" />
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-250">No Users Found</h4>
          <p className="text-xs text-slate-450 dark:text-slate-400 mt-2 max-w-sm leading-relaxed">
            No users matched your current search parameters. Double-check spelling or adjust search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div key={user.id}>
              <UserCard user={user} onManageRoles={handleManageRolesClick} />
            </div>
          ))}
        </div>
      )}

      {/* Manage Roles Modal */}
      <UserRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
};
export default UserManagement;
