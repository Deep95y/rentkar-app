// src/app/api/bookings/[id]/approve-docs/route.ts
import { NextResponse } from 'next/server';
import { collection } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id: bookingId } = await params;
	
	try {
		const bookings = await collection('bookings');
		
		// Get the current booking
		const booking = await bookings.findOne({ _id: new ObjectId(bookingId) });
		if (!booking) {
			return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
		}
		
		// Update all documents to APPROVED status
		const updatedDocuments = booking.document.map((doc: any) => ({
			...doc,
			status: 'APPROVED'
		}));
		
		const updated = await bookings.updateOne(
			{ _id: new ObjectId(bookingId) },
			{ $set: { document: updatedDocuments } }
		);
		
		if (updated.modifiedCount === 0) {
			return NextResponse.json({ error: 'UPDATE_FAILED' }, { status: 500 });
		}
		
		return NextResponse.json({ ok: true, message: 'Documents approved successfully' });
	} catch (error) {
		return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
	}
}
