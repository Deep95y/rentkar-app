// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import { collection } from '@/lib/db';

export async function GET() {
	const products = await collection('products');
	const list = await products.find({ status: { $ne: 'inactive' } }).limit(200).toArray();
	return NextResponse.json(list);
}




