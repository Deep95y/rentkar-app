// src/app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { collection } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const products = await collection('products');
	const item = await products.findOne({ _id: new ObjectId(id) });
	if (!item) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
	return NextResponse.json(item);
}




