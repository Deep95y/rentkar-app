// src/app/api/bookings/route.ts
import { NextResponse } from 'next/server';
import { collection } from '@/lib/db';

export async function GET() {
	const bookings = await collection('bookings');
	const list = await bookings.find({}).limit(100).toArray();
	return NextResponse.json(list);
}
