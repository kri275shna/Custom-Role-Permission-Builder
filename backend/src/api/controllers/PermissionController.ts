import { Request, Response, NextFunction } from 'express';
import { SYSTEM_PERMISSIONS } from '../../data/mock-db';

export class PermissionController {
  getPermissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        success: true,
        data: SYSTEM_PERMISSIONS
      });
    } catch (error) {
      next(error);
    }
  };
}
