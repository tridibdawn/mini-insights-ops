import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware';
import { getAllUsers } from '@/lib/data/users';

export const GET = requireRole(['admin'], async (request: NextRequest) => {
  const users = getAllUsers();
  return NextResponse.json({ users });
});
