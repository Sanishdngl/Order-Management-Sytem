export enum Role {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export const permissions: Record<Role, string[]> = {
  [Role.ADMIN]: [
    'products:read',
    'products:create',
    'products:update',
    'products:delete',
    'orders:read',
    'orders:create',
    'orders:update',
  ],
  [Role.EDITOR]: [
    'products:read',
    'products:create',
    'products:update',
    'orders:read',
    'orders:create',
    'orders:update',
  ],
  [Role.VIEWER]: ['products:read', 'orders:read'],
};

export const hasPermission = (role: Role, permission: string): boolean => {
  return permissions[role]?.includes(permission) ?? false;
};
