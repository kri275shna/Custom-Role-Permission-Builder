import { User, Role, UserRole } from '../models/types';
import { UserRepository } from '../repositories/UserRepository';
import { RoleRepository } from '../repositories/RoleRepository';
import { SYSTEM_PERMISSIONS } from '../data/mock-db';

export class UserService {
  private userRepository = new UserRepository();
  private roleRepository = new RoleRepository();

  async getAllUsers(): Promise<Array<User & { roles: Role[] }>> {
    const users = await this.userRepository.findAll();
    const result: Array<User & { roles: Role[] }> = [];

    for (const user of users) {
      const userRoles = await this.userRepository.findUserRoles(user.id);
      const roles: Role[] = [];
      for (const ur of userRoles) {
        const role = await this.roleRepository.findById(ur.roleId);
        if (role) {
          roles.push(role);
        }
      }
      result.push({
        ...user,
        roles
      });
    }

    return result;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<UserRole> {
    const userExists = await this.userRepository.exists(userId);
    if (!userExists) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    return this.userRepository.assignRole(userId, roleId);
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<boolean> {
    const userExists = await this.userRepository.exists(userId);
    if (!userExists) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const assignment = await this.userRepository.findAssignment(userId, roleId);
    if (!assignment) {
      throw new Error(`Role assignment for Role ID ${roleId} does not exist on User ID ${userId}`);
    }

    return this.userRepository.removeRole(userId, roleId);
  }

  /**
   * PERMISSION RESOLUTION ENGINE
   * Resolves effective permissions by computing a union of all assigned roles.
   * Grouped by resource for frontend consumption and fast UI checks.
   */
  async getEffectivePermissions(userId: string): Promise<Record<string, string[]>> {
    const userExists = await this.userRepository.exists(userId);
    if (!userExists) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const userRoles = await this.userRepository.findUserRoles(userId);
    const flatPermissionsSet = new Set<string>();

    for (const ur of userRoles) {
      const role = await this.roleRepository.findById(ur.roleId);
      if (role) {
        role.permissions.forEach(perm => flatPermissionsSet.add(perm));
      }
    }

    // Initialize resolution container with empty arrays for all system resources
    const resolvedMatrix: Record<string, string[]> = {};
    Object.keys(SYSTEM_PERMISSIONS).forEach(resource => {
      resolvedMatrix[resource] = [];
    });

    // Populate resolved permissions
    flatPermissionsSet.forEach(permString => {
      const [resource, action] = permString.split(':');
      if (resolvedMatrix[resource]) {
        resolvedMatrix[resource].push(action);
      }
    });

    // Sort actions for deterministic outcomes
    Object.keys(resolvedMatrix).forEach(resource => {
      resolvedMatrix[resource].sort();
    });

    return resolvedMatrix;
  }
}
