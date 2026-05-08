import bcrypt from 'bcryptjs';
import { Role } from './roles';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export const users: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    role: Role.ADMIN,
  },
  {
    id: 2,
    name: 'Editor User',
    email: 'editor@example.com',
    password: bcrypt.hashSync('editor123', 10),
    role: Role.EDITOR,
  },
  {
    id: 3,
    name: 'Viewer User',
    email: 'viewer@example.com',
    password: bcrypt.hashSync('viewer123', 10),
    role: Role.VIEWER,
  },
];

export const findUserByEmail = (email: string): User | null => {
  return users.find((u) => u.email === email) || null;
};
