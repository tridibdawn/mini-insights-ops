import { User } from '../types';
import { hashPassword } from '../auth';

// In-memory user store
let users: User[] = [];

// Initialize with default users
export async function initializeUsers() {
  if (users.length === 0) {
    users = [
      {
        id: '1',
        email: 'admin@test.com',
        password: await hashPassword('password'),
        role: 'admin',
        name: 'Admin User',
      },
      {
        id: '2',
        email: 'analyst@test.com',
        password: await hashPassword('password'),
        role: 'analyst',
        name: 'Analyst User',
      },
      {
        id: '3',
        email: 'viewer@test.com',
        password: await hashPassword('password'),
        role: 'viewer',
        name: 'Viewer User',
      },
    ];
  }
}

export function getAllUsers(): Omit<User, 'password'>[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return users.map(({ password, ...user }) => user);
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email);
}

export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function updateUserRole(userId: string, role: User['role']): boolean {
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].role = role;
    return true;
  }
  return false;
}
