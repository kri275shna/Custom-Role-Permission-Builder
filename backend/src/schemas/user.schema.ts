import { z } from 'zod';

export const assignRoleSchema = z.object({
  roleId: z
    .string({ required_error: 'Role ID is required' })
    .min(1, { message: 'Role ID cannot be empty' })
});

export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
