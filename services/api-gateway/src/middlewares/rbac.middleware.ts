import { Response, NextFunction } from 'express';
import { hasPermission } from '../config/roles';
import { AuthRequest } from './auth.middleware';

export const rbac = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized — no user found in request.',
      });
    }

    if (!hasPermission(user.role, permission)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden — your role "${user.role}" cannot perform "${permission}".`,
      });
    }

    console.log(`RBAC passed: [${user.role}] → ${permission}`);
    next();
  };
};
