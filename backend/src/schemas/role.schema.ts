import { z } from 'zod';
import { ALL_PERMISSIONS_FLAT } from '../data/mock-db';

export const createRoleSchema = z.object({
  name: z
    .string({ required_error: 'Role name is required' })
    .min(3, { message: 'Role name must be at least 3 characters long' })
    .max(50, { message: 'Role name cannot exceed 50 characters' })
    .regex(/^[a-zA-Z0-9\s-_]+$/, {
      message: 'Role name can only contain letters, numbers, spaces, hyphens, and underscores'
    }),
  description: z
    .string()
    .max(200, { message: 'Description cannot exceed 200 characters' })
    .default(''),
  permissions: z
    .array(
      z.string().refine(perm => ALL_PERMISSIONS_FLAT.includes(perm), {
        message: 'Invalid permission string'
      })
    )
    .default([])
});

export const updateRoleSchema = createRoleSchema.partial();
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
