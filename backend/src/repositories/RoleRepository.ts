import { Role } from '../models/types';
import { mockRoles } from '../data/mock-db';
import { randomUUID } from 'crypto';

export class RoleRepository {
  async findAll(): Promise<Role[]> {
    return [...mockRoles];
  }

  async findById(id: string): Promise<Role | null> {
    const role = mockRoles.find(r => r.id === id);
    return role ? { ...role } : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const role = mockRoles.find(r => r.name.toLowerCase() === name.toLowerCase());
    return role ? { ...role } : null;
  }

  async create(roleData: Omit<Role, 'id' | 'isSystem'>): Promise<Role> {
    const newRole: Role = {
      id: `role-${randomUUID()}`,
      name: roleData.name,
      description: roleData.description,
      permissions: [...roleData.permissions],
      isSystem: false
    };
    mockRoles.push(newRole);
    return { ...newRole };
  }

  async update(id: string, roleData: Partial<Omit<Role, 'id' | 'isSystem'>>): Promise<Role | null> {
    const index = mockRoles.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    // Safety guard: System roles cannot be updated
    if (mockRoles[index].isSystem) {
      throw new Error('System roles cannot be modified');
    }

    mockRoles[index] = {
      ...mockRoles[index],
      ...roleData,
      // Retain ID and system flags
      id: mockRoles[index].id,
      isSystem: false
    };
    return { ...mockRoles[index] };
  }

  async delete(id: string): Promise<boolean> {
    const index = mockRoles.findIndex(r => r.id === id);
    if (index === -1) return false;

    // Safety guard: System roles cannot be deleted
    if (mockRoles[index].isSystem) {
      throw new Error('System roles cannot be deleted');
    }

    mockRoles.splice(index, 1);
    return true;
  }
}
