// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';
import type { UserRole } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role, profile } = body;

    // Validation
    if (!email || !password || !role || !profile?.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles: UserRole[] = ['CUSTOMER', 'ADMIN', 'PARTNER'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const result = await createUser({
      email,
      password,
      role,
      profile: {
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
      },
    });

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
