// src/app/api/bookings/[id]/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { collection } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id: bookingId } = await params;
	const body = await req.json().catch(() => null);
	
	if (!body || !Array.isArray(body.documents)) {
		return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 });
	}

	try {
		const bookings = await collection('bookings');
		const updated = await bookings.updateOne(
			{ _id: new ObjectId(bookingId) },
			{ $set: { document: body.documents } }
		);
		
		if (updated.matchedCount === 0) {
			return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
		}
		
		return NextResponse.json({ ok: true });
	} catch (error) {
		return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
	}
}
