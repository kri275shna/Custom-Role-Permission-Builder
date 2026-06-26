import { Role } from '../models/types';
import { RoleRepository } from '../repositories/RoleRepository';
import { UserRepository } from '../repositories/UserRepository';
import { ALL_PERMISSIONS_FLAT } from '../data/mock-db';

export class RoleService {
  private roleRepository = new RoleRepository();
  private userRepository = new UserRepository();

  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }

  async getRoleById(id: string): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error(`Role with ID ${id} not found`);
    }
    return role;
  }

  async createRole(roleData: { name: string; description: string; permissions: string[] }): Promise<Role> {
    // Validate role name is not duplicate
    const existing = await this.roleRepository.findByName(roleData.name);
    if (existing) {
      throw new Error(`Role with name "${roleData.name}" already exists`);
    }

    // Validate that all permissions are valid system permissions
    for (const perm of roleData.permissions) {
      if (!ALL_PERMISSIONS_FLAT.includes(perm)) {
        throw new Error(`Permission "${perm}" is not a valid system permission`);
      }
    }

    return this.roleRepository.create(roleData);
  }

  async updateRole(
    id: string,
    roleData: { name?: string; description?: string; permissions?: string[] }
  ): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error(`Role with ID ${id} not found`);
    }

    if (role.isSystem) {
      throw new Error('System roles cannot be modified');
    }

    // If changing name, ensure uniqueness
    if (roleData.name && roleData.name.toLowerCase() !== role.name.toLowerCase()) {
      const existing = await this.roleRepository.findByName(roleData.name);
      if (existing) {
        throw new Error(`Role with name "${roleData.name}" already exists`);
      }
    }

    // If changing permissions, validate
    if (roleData.permissions) {
      for (const perm of roleData.permissions) {
        if (!ALL_PERMISSIONS_FLAT.includes(perm)) {
          throw new Error(`Permission "${perm}" is not a valid system permission`);
        }
      }
    }

    const updated = await this.roleRepository.update(id, roleData);
    if (!updated) {
      throw new Error(`Failed to update role with ID ${id}`);
    }
    return updated;
  }

  async deleteRole(id: string): Promise<boolean> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error(`Role with ID ${id} not found`);
    }

    if (role.isSystem) {
      throw new Error('System roles cannot be deleted');
    }

    // 1. Delete all user role assignments for this role (Cascade clean)
    await this.userRepository.removeAllUserRolesByRole(id);

    // 2. Delete the role from memory
    return this.roleRepository.delete(id);
  }
}
