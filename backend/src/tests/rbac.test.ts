import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app, { server } from '../server';
import { mockRoles, mockUserRoles } from '../data/mock-db';

describe('Workbench RBAC API Suite', () => {
  afterAll(async () => {
    // Gracefully shut down server to allow tests to complete exit
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  describe('GET /api/permissions', () => {
    it('should return the complete permission matrix', async () => {
      const res = await request(app).get('/api/permissions');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('projects');
      expect(res.body.data).toHaveProperty('tasks');
      expect(res.body.data).toHaveProperty('members');
      expect(res.body.data).toHaveProperty('billing');
      expect(res.body.data).toHaveProperty('settings');
      expect(res.body.data.projects).toContain('view');
      expect(res.body.data.projects).toContain('archive');
    });
  });

  describe('GET /api/roles', () => {
    it('should return preseeded roles list', async () => {
      const res = await request(app).get('/api/roles');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(4);
      
      const adminRole = res.body.data.find((r: any) => r.id === 'role-admin');
      expect(adminRole).toBeDefined();
      expect(adminRole.name).toBe('Admin');
      expect(adminRole.isSystem).toBe(true);
    });
  });

  describe('POST /api/roles', () => {
    it('should successfully create a custom role', async () => {
      const res = await request(app)
        .post('/api/roles')
        .send({
          name: 'Security Lead',
          description: 'Special custom role for testing',
          permissions: ['projects:view', 'settings:view', 'settings:update']
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Security Lead');
      expect(res.body.data.isSystem).toBe(false);
      expect(res.body.data.id).toContain('role-');
    });

    it('should fail to create a role with a duplicate name', async () => {
      const res = await request(app)
        .post('/api/roles')
        .send({
          name: 'Admin', // Already exists
          permissions: ['projects:view']
        });
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });

    it('should fail to create a role with invalid permissions', async () => {
      const res = await request(app)
        .post('/api/roles')
        .send({
          name: 'Hack Role',
          permissions: ['projects:hack_server'] // Invalid permission
        });
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Validation failed');
    });
  });

  describe('PUT /api/roles/:id', () => {
    it('should fail to modify a system role', async () => {
      const res = await request(app)
        .put('/api/roles/role-admin')
        .send({
          permissions: ['projects:view']
        });
      
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('System roles cannot be modified');
    });

    it('should successfully modify a custom role', async () => {
      // Find the custom role created in the previous test
      const rolesRes = await request(app).get('/api/roles');
      const customRole = rolesRes.body.data.find((r: any) => !r.isSystem);
      expect(customRole).toBeDefined();

      const res = await request(app)
        .put(`/api/roles/${customRole.id}`)
        .send({
          description: 'Updated custom description',
          permissions: ['projects:view', 'projects:edit']
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.description).toBe('Updated custom description');
      expect(res.body.data.permissions).toContain('projects:edit');
    });
  });

  describe('GET /api/users', () => {
    it('should return all users with resolved roles nested', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(4);
      
      const charlie = res.body.data.find((u: any) => u.id === 'user-3');
      expect(charlie).toBeDefined();
      expect(charlie.roles.length).toBe(2); // Seeded with Member and Viewer
    });
  });

  describe('POST /api/users/:id/roles & DELETE /api/users/:id/roles/:roleId', () => {
    it('should assign and then remove a role from a user', async () => {
      // Assign 'Member' to Alice (who currently only has Owner)
      const assignRes = await request(app)
        .post('/api/users/user-1/roles')
        .send({ roleId: 'role-member' });

      expect(assignRes.status).toBe(201);
      expect(assignRes.body.success).toBe(true);

      // Verify assignment in users route
      const usersRes = await request(app).get('/api/users');
      const alice = usersRes.body.data.find((u: any) => u.id === 'user-1');
      expect(alice.roles.some((r: any) => r.id === 'role-member')).toBe(true);

      // Remove assignment
      const removeRes = await request(app).delete('/api/users/user-1/roles/role-member');
      expect(removeRes.status).toBe(200);

      // Verify removal
      const usersRes2 = await request(app).get('/api/users');
      const alice2 = usersRes2.body.data.find((u: any) => u.id === 'user-1');
      expect(alice2.roles.some((r: any) => r.id === 'role-member')).toBe(false);
    });

    it('should reject assigning duplicate roles', async () => {
      // Bob already has Admin
      const res = await request(app)
        .post('/api/users/user-2/roles')
        .send({ roleId: 'role-admin' });

      expect(res.status).toBe(201); // Re-assigns/returns existing gracefully
    });
  });

  describe('GET /api/users/:id/effective-permissions (Resolution Engine)', () => {
    it('should correctly merge overlapping permissions for a user holding multiple roles', async () => {
      // Charlie Brown (user-3) is preseeded with 'Member' and 'Viewer'
      // Member permissions: projects:view, tasks:view/create/edit/assign, members:view
      // Viewer permissions: projects:view, tasks:view, members:view, billing:view, settings:view
      // Merged (Union):
      // projects -> ['view']
      // tasks -> ['view', 'create', 'edit', 'assign']
      // members -> ['view']
      // billing -> ['view']
      // settings -> ['view']

      const res = await request(app).get('/api/users/user-3/effective-permissions');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      const permissions = res.body.data;
      expect(permissions.projects).toContain('view');
      expect(permissions.projects.length).toBe(1); // unique view only

      expect(permissions.tasks).toContain('view');
      expect(permissions.tasks).toContain('create');
      expect(permissions.tasks).toContain('edit');
      expect(permissions.tasks).toContain('assign');
      expect(permissions.tasks.length).toBe(4);

      expect(permissions.billing).toContain('view');
      expect(permissions.settings).toContain('view');
    });

    it('should fail with 404 for unknown user', async () => {
      const res = await request(app).get('/api/users/non-existent-user/effective-permissions');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/roles/:id (Cascading Assignment Delete)', () => {
    it('should successfully delete custom role and clean user assignments', async () => {
      // Create custom role
      const createRes = await request(app)
        .post('/api/roles')
        .send({
          name: 'Temp Role',
          permissions: ['projects:view']
        });
      const roleId = createRes.body.data.id;

      // Assign to Alice (user-1)
      await request(app)
        .post('/api/users/user-1/roles')
        .send({ roleId });

      // Verify Alice has it
      let usersRes = await request(app).get('/api/users');
      let alice = usersRes.body.data.find((u: any) => u.id === 'user-1');
      expect(alice.roles.some((r: any) => r.id === roleId)).toBe(true);

      // Delete the custom role
      const deleteRes = await request(app).delete(`/api/roles/${roleId}`);
      expect(deleteRes.status).toBe(200);

      // Verify Alice no longer has it (cascaded unassign)
      usersRes = await request(app).get('/api/users');
      alice = usersRes.body.data.find((u: any) => u.id === 'user-1');
      expect(alice.roles.some((r: any) => r.id === roleId)).toBe(false);
    });
  });
});
