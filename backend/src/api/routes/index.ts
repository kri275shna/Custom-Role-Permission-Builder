import { Router } from 'express';
import permissionRouter from './permissions.routes';
import roleRouter from './roles.routes';
import userRouter from './users.routes';

const router = Router();

router.use('/permissions', permissionRouter);
router.use('/roles', roleRouter);
router.use('/users', userRouter);

export default router;
