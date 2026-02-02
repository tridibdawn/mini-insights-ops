import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import { AuthUser } from './types';

export function getAuthUser(request: NextRequest): AuthUser | null {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  
  return verifyToken(token);
}

export function requireAuth(handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const user = getAuthUser(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return handler(req, user);
  };
}

export function requireRole(
  roles: AuthUser['role'][],
  handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>
) {
  return requireAuth(async (req: NextRequest, user: AuthUser) => {
    if (!roles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }
    
    return handler(req, user);
  });
}
