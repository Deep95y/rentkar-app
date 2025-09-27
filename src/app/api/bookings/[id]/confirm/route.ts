// src/app/api/bookings/[id]/confirm/route.ts
import { NextResponse } from 'next/server';
import { collection } from '@/lib/db';
import { withLock, pubsub } from '@/lib/redis';
import type { Booking } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id: bookingId } = await params;
	try {
		const result = await withLock(`booking:${bookingId}:confirm`, 5000, async () => {
			const bookings = await collection<Booking>('bookings');
			const booking = await bookings.findOne({ _id: new ObjectId(bookingId) });
			if (!booking) return { error: 'NOT_FOUND' as const };
			if (booking.status === 'CONFIRMED') return { error: 'ALREADY_CONFIRMED' as const };
			if (!Array.isArray(booking.document) || booking.document.some((d) => d.status !== 'APPROVED')) {
				return { error: 'DOCS_NOT_APPROVED' as const };
			}
			const updated = await bookings.updateOne(
				{ _id: new ObjectId(bookingId), status: { $ne: 'CONFIRMED' } },
				{ $set: { status: 'CONFIRMED' } }
			);
			if (updated.modifiedCount === 0) return { error: 'CONFLICT' as const };
			await pubsub.publish('booking:confirmed', { bookingId });
			return { ok: true as const };
		});
		if ('error' in result) return NextResponse.json(result, { status: 409 });
		return NextResponse.json(result);
	} catch (e) {
		if (e instanceof Error && e.message === 'LOCK_NOT_ACQUIRED') return NextResponse.json({ error: 'LOCK_BUSY' }, { status: 423 });
		return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
	}
}
