import { User, UserRole } from '../models/types';
import { mockUsers, mockUserRoles, mockRoles } from '../data/mock-db';
import { randomUUID } from 'crypto';

export class UserRepository {
  async findAll(): Promise<User[]> {
    return [...mockUsers];
  }

  async findById(id: string): Promise<User | null> {
    const user = mockUsers.find(u => u.id === id);
    return user ? { ...user } : null;
  }

  async exists(id: string): Promise<boolean> {
    return mockUsers.some(u => u.id === id);
  }

  async findUserRoles(userId: string): Promise<UserRole[]> {
    return mockUserRoles.filter(ur => ur.userId === userId).map(ur => ({ ...ur }));
  }

  async findAssignment(userId: string, roleId: string): Promise<UserRole | null> {
    const assignment = mockUserRoles.find(ur => ur.userId === userId && ur.roleId === roleId);
    return assignment ? { ...assignment } : null;
  }

  async assignRole(userId: string, roleId: string): Promise<UserRole> {
    // Check if role exists
    const roleExists = mockRoles.some(r => r.id === roleId);
    if (!roleExists) {
      throw new Error(`Role with ID ${roleId} does not exist`);
    }

    // Check if user exists
    const userExists = await this.exists(userId);
    if (!userExists) {
      throw new Error(`User with ID ${userId} does not exist`);
    }

    // Check for duplicate assignment
    const existing = await this.findAssignment(userId, roleId);
    if (existing) {
      return existing;
    }

    const newAssignment: UserRole = {
      id: `ur-${randomUUID()}`,
      userId,
      roleId
    };
    mockUserRoles.push(newAssignment);
    return { ...newAssignment };
  }

  async removeRole(userId: string, roleId: string): Promise<boolean> {
    const index = mockUserRoles.findIndex(ur => ur.userId === userId && ur.roleId === roleId);
    if (index === -1) return false;
    
    mockUserRoles.splice(index, 1);
    return true;
  }

  async removeAllUserRolesByRole(roleId: string): Promise<number> {
    let count = 0;
    for (let i = mockUserRoles.length - 1; i >= 0; i--) {
      if (mockUserRoles[i].roleId === roleId) {
        mockUserRoles.splice(i, 1);
        count++;
      }
    }
    return count;
  }
}
