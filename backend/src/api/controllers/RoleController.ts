import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../../services/RoleService';

export class RoleController {
  private roleService = new RoleService();

  getAllRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roles = await this.roleService.getAllRoles();
      res.status(200).json({
        success: true,
        data: roles
      });
    } catch (error) {
      next(error);
    }
  };

  getRoleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const role = await this.roleService.getRoleById(id);
      res.status(200).json({
        success: true,
        data: role
      });
    } catch (error) {
      next(error);
    }
  };

  createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newRole = await this.roleService.createRole(req.body);
      res.status(201).json({
        success: true,
        message: 'Role created successfully',
        data: newRole
      });
    } catch (error) {
      next(error);
    }
  };

  updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedRole = await this.roleService.updateRole(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Role updated successfully',
        data: updatedRole
      });
    } catch (error) {
      next(error);
    }
  };

  deleteRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.roleService.deleteRole(id);
      res.status(200).json({
        success: true,
        message: 'Role deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
