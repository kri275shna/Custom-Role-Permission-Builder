# Testing Strategy & Walkthrough — Workbench RBAC

This document outlines the testing methodologies used to verify the correctness, reliability, and security of the Workbench RBAC Permission Builder.

---

## 1. Automated Integration Tests
The backend features an integration test suite implemented with **Vitest** and **Supertest** located at `backend/src/tests/rbac.test.ts`.

To execute these tests:
```bash
cd backend
npm run test
```

### Verified Test Scenarios (13 Cases)
1. **GET /api/permissions**: Verifies that the complete system permission matrix is returned in a structured format.
2. **GET /api/roles**: Confirms all default system roles (Owner, Admin, Member, Viewer) are preseeded.
3. **POST /api/roles (Success)**: Verifies a custom role can be created with a description and selected permissions.
4. **POST /api/roles (Duplicate Error)**: Checks that creating a role with a name matching an existing role fails with a `400 Bad Request`.
5. **POST /api/roles (Invalid Permission)**: Confirms that attempting to bind an arbitrary permission (e.g. `projects:hack_server`) is rejected by Zod validation.
6. **PUT /api/roles/:id (System Locked)**: Confirms system-preseeded roles cannot be modified.
7. **PUT /api/roles/:id (Custom Success)**: Verifies custom roles can update their permissions list and descriptions.
8. **GET /api/users**: Verifies all team members are returned with their active role assignments nested.
9. **POST /api/users/:id/roles**: Tests assigning a role to a user.
10. **POST /api/users/:id/roles (Duplicate Assign)**: Asserts that double-assigning a role returns the existing mapping without duplication.
11. **DELETE /api/users/:id/roles/:roleId**: Verifies role unassignment correctly removes the role from the user.
12. **GET /api/users/:id/effective-permissions (Resolution Engine)**: Validates that Charlie Brown (who holds both `Member` and `Viewer` roles) correctly resolves to a unioned, duplicate-free permission matrix.
13. **DELETE /api/roles/:id (Cascading Delete)**: Tests that deleting a custom role automatically triggers a cascading cleanup, unassigning the deleted role from any active user.

---

## 2. Manual Verification Guide

### Visual Overlap Verification
1. Open the **User Directory** and note Charlie Brown has two roles: `Member` and `Viewer`.
2. Navigate to the **Effective Permissions** page and select **Charlie Brown**.
3. Inspect the resolved permission matrix:
   - Charlie holds all permissions of a `Member` plus the `Billing: view` and `Settings: view` permissions from `Viewer`.
   - The trace log on the right side maps each checked permission to both granting roles, demonstrating successful union resolution.

### System Safety Verification
1. Navigate to **Roles & Permissions**.
2. Identify a **System** role (e.g. Admin). Note that the Edit and Delete options are locked.
3. Create a **Custom** role (e.g. Support Lead) and select a few permissions.
4. Note that this role now appears in the list with active Edit and Delete buttons.
5. Delete the custom role and confirm that it is successfully removed from the lists.
