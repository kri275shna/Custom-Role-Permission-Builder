import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Role } from '../types/rbac';
import { RoleCard } from '../components/RoleCard';
import { SearchInput } from '../components/SearchInput';
import { RoleFormModal } from '../components/RoleFormModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Plus, ShieldAlert } from 'lucide-react';

export const RoleManagement: React.FC = () => {
  const { roles, isLoading, deleteRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);

  // Delete Dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
        </div>
        <LoadingSkeleton type="card" />
      </div>
    );
  }

  // Filter roles by name or description search query
  const filteredRoles = roles.filter(
    role =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClick = () => {
    setRoleToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (role: Role) => {
    setRoleToEdit(role);
    setIsFormModalOpen(true);
  };

  const handleCloneClick = (role: Role) => {
    // Clone role: Open modal in create mode but prefill description and permissions
    const clonedRole: Omit<Role, 'id'> = {
      name: `${role.name} Copy`,
      description: `Cloned from: ${role.name}. ${role.description}`,
      permissions: [...role.permissions],
      isSystem: false
    };
    setRoleToEdit(clonedRole as Role); // Cast as Role (id is undefined, but form handles it as create mode)
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    setIsDeleting(true);
    try {
      await deleteRole(roleToDelete.id);
      setIsDeleteOpen(false);
      setRoleToDelete(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-150 dark:border-slate-850/40 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Roles & Permissions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build custom roles, select matrix permissions, or view preseeded system roles.
          </p>
        </div>
        <button onClick={handleCreateClick} className="btn-primary">
          <Plus className="h-4 w-4" />
          <span>Create Role</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between items-center bg-slate-50/50 dark:bg-[#121526]/50 p-4 border border-slate-150 dark:border-slate-800/40 rounded-2xl">
        <SearchInput
          value={searchQuery}
          onChangeValue={setSearchQuery}
          placeholder="Filter roles by name..."
        />
        <div className="text-xs text-slate-450 dark:text-slate-400 font-medium">
          Showing {filteredRoles.length} of {roles.length} Roles
        </div>
      </div>

      {/* Roles Grid */}
      {filteredRoles.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#101222]/80 border border-slate-200 dark:border-slate-800/60 rounded-3xl text-center">
          <ShieldAlert className="h-12 w-12 text-slate-400 mb-4 stroke-[1.5px]" />
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-250">No Roles Found</h4>
          <p className="text-xs text-slate-450 dark:text-slate-400 mt-2 max-w-sm leading-relaxed">
            No roles matched your current search parameters. Create a new custom role or adjust your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map(role => (
            <div key={role.id} className="h-full">
              <RoleCard
                role={role}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onClone={handleCloneClick}
              />
            </div>
          ))}
        </div>
      )}

      {/* Role Creation/Editing Modal */}
      <RoleFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setRoleToEdit(null);
        }}
        roleToEdit={roleToEdit}
      />

      {/* Role Deletion Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteOpen}
        title="Delete Custom Role"
        message={`Are you sure you want to delete the custom role "${roleToDelete?.name}"? Any users assigned to this role will automatically have it removed. This action is irreversible.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setRoleToDelete(null);
        }}
        isLoading={isDeleting}
      />
    </div>
  );
};
export default RoleManagement;
