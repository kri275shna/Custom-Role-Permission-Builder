import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/UserService';

export class UserController {
  private userService = new UserService();

  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  };

  assignRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params; // userId
      const { roleId } = req.body;
      const assignment = await this.userService.assignRoleToUser(id, roleId);
      res.status(201).json({
        success: true,
        message: 'Role assigned successfully',
        data: assignment
      });
    } catch (error) {
      next(error);
    }
  };

  removeRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, roleId } = req.params;
      await this.userService.removeRoleFromUser(id, roleId);
      res.status(200).json({
        success: true,
        message: 'Role removed successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  getEffectivePermissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const permissions = await this.userService.getEffectivePermissions(id);
      res.status(200).json({
        success: true,
        data: permissions
      });
    } catch (error) {
      next(error);
    }
  };
}
