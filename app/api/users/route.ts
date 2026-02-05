import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware';
import { getAllUsers, initializeUsers } from '@/lib/data/users';

export const GET = requireRole(['admin'], async () => {
  // Initialize users before fetching
  await initializeUsers();
  
  const users = getAllUsers();
  return NextResponse.json({ users });
});
