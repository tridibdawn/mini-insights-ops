import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthUser, User, UserRole } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function hasPermission(userRole: UserRole, action: 'read' | 'create' | 'edit' | 'delete' | 'manage_users'): boolean {
  const permissions = {
    admin: ['read', 'create', 'edit', 'delete', 'manage_users'],
    analyst: ['read', 'create', 'edit'],
    viewer: ['read'],
  };
  
  return permissions[userRole].includes(action);
}

export function canManageUsers(userRole: UserRole): boolean {
  return userRole === 'admin';
}

export function canCreateOrEdit(userRole: UserRole): boolean {
  return userRole === 'admin' || userRole === 'analyst';
}

export function canDelete(userRole: UserRole): boolean {
  return userRole === 'admin';
}
