// src/app/api/partners/route.ts
import { NextResponse } from 'next/server';
import { collection } from '@/lib/db';

export async function GET() {
	const partners = await collection('partners');
	const list = await partners.find({}).limit(100).toArray();
	return NextResponse.json(list);
}
