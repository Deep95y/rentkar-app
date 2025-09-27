// src/app/api/partners/[id]/gps/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { collection } from '@/lib/db';
import { rateLimitAllow, pubsub } from '@/lib/redis';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id: partnerId } = await params;
	const body = await req.json().catch(() => null);
	if (!body || typeof body.lat !== 'number' || typeof body.lng !== 'number') {
		return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 });
	}
	const allow = await rateLimitAllow(`gps:${partnerId}`, 6, 60);
	if (!allow) return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
	const partners = await collection('partners');
	const res = await partners.updateOne(
		{ _id: new ObjectId(partnerId) },
		{ $set: { location: { lat: body.lat, lng: body.lng }, lastGpsAt: new Date().toISOString() } }
	);
	if (res.matchedCount === 0) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
	await pubsub.publish('partner:gps', { partnerId, lat: body.lat, lng: body.lng });
	return NextResponse.json({ ok: true });
}
