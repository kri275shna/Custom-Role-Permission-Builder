import { Router } from 'express';
import { PermissionController } from '../controllers/PermissionController';

const router = Router();
const controller = new PermissionController();

router.get('/', controller.getPermissions);

export default router;
