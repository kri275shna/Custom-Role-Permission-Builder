import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validateBody } from '../middleware/validation.middleware';
import { assignRoleSchema } from '../../schemas/user.schema';

const router = Router();
const controller = new UserController();

router.get('/', controller.getAllUsers);
router.post('/:id/roles', validateBody(assignRoleSchema), controller.assignRole);
router.delete('/:id/roles/:roleId', controller.removeRole);
router.get('/:id/effective-permissions', controller.getEffectivePermissions);

export default router;
