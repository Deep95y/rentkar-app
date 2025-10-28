// src/lib/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { collection } from './db';
import type { User, UserRole } from './types';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface AuthUser {
  _id: string;
  email: string;
  role: UserRole;
  profile: {
    name: string;
    phone?: string;
    city?: string;
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      _id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      profile: decoded.profile || { name: '' }
    };
  } catch (error) {
    return null;
  }
}

export async function createUser(userData: {
  email: string;
  password: string;
  role: UserRole;
  profile: {
    name: string;
    phone?: string;
    city?: string;
  };
}): Promise<{ user: AuthUser; token: string } | { error: string }> {
  try {
    const users = await collection<User>('users');
    
    // Check if user already exists
    const existingUser = await users.findOne({ email: userData.email });
    if (existingUser) {
      return { error: 'User already exists' };
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const newUser: User = {
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      profile: userData.profile,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    const result = await users.insertOne(newUser);
    const userId = result.insertedId.toString();

    const authUser: AuthUser = {
      _id: userId,
      email: userData.email,
      role: userData.role,
      profile: userData.profile,
    };

    const token = generateToken(authUser);

    return { user: authUser, token };
  } catch (error) {
    console.error('Error creating user:', error);
    return { error: 'Failed to create user' };
  }
}

export async function authenticateUser(email: string, password: string): Promise<{ user: AuthUser; token: string } | { error: string }> {
  try {
    const users = await collection<User>('users');
    const user = await users.findOne({ email, status: 'active' });

    if (!user) {
      return { error: 'Invalid credentials' };
    }

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return { error: 'Invalid credentials' };
    }

    // Update last login
    await users.updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: new Date().toISOString() } }
    );

    const authUser: AuthUser = {
      _id: user._id!.toString(),
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    const token = generateToken(authUser);

    return { user: authUser, token };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { error: 'Authentication failed' };
  }
}

export async function getUserById(userId: string): Promise<AuthUser | null> {
  try {
    const users = await collection<User>('users');
    const user = await users.findOne({ _id: new ObjectId(userId), status: 'active' });

    if (!user) {
      return null;
    }

    return {
      _id: user._id!.toString(),
      email: user.email,
      role: user.role,
      profile: user.profile,
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}
