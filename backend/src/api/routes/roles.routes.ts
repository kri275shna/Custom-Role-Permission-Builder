import { Router } from 'express';
import { RoleController } from '../controllers/RoleController';
import { validateBody } from '../middleware/validation.middleware';
import { createRoleSchema, updateRoleSchema } from '../../schemas/role.schema';

const router = Router();
const controller = new RoleController();

router.get('/', controller.getAllRoles);
router.get('/:id', controller.getRoleById);
router.post('/', validateBody(createRoleSchema), controller.createRole);
router.put('/:id', validateBody(updateRoleSchema), controller.updateRole);
router.delete('/:id', controller.deleteRole);

export default router;
