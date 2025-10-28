// src/app/api/bookings/route.ts
import { NextResponse } from 'next/server';
import { collection } from '@/lib/db';
import { ObjectId } from 'mongodb';
import type { Booking, Product } from '@/lib/types';

export async function GET() {
	const bookings = await collection('bookings');
	const list = await bookings.find({}).limit(100).toArray();
	return NextResponse.json(list);
}

export async function POST(req: Request) {
	const body = await req.json().catch(() => null);
	if (!body) return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 });
	const {
		userId,
		packageId,
		planDurationDays,
		startDate,
		endDate,
		isSelfPickup = false,
		location,
		deliveryTime,
		address,
	} = body as Record<string, any>;

	if (!userId || !packageId || !planDurationDays || !startDate || !endDate || !address) {
		return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });
	}

	const products = await collection<Product>('products');
	const product = await products.findOne({ _id: new ObjectId(packageId) });
	if (!product) return NextResponse.json({ error: 'PRODUCT_NOT_FOUND' }, { status: 404 });

	const plan = product.plans.find((p) => p.durationDays === Number(planDurationDays));
	if (!plan) return NextResponse.json({ error: 'PLAN_NOT_FOUND' }, { status: 404 });

	const basePrice = plan.price;
	const deliveryCharge = isSelfPickup ? 0 : 250;
	const grandTotal = basePrice + deliveryCharge + (product.deposit || 0);

	const booking: Booking = {
		userId: new ObjectId(userId),
		packageId: new ObjectId(packageId),
		startDate,
		endDate,
		isSelfPickup,
		location: location || product.city || 'mumbai',
		deliveryTime: deliveryTime || { startHour: 10, endHour: 12 },
		selectedPlan: { duration: plan.durationDays, price: plan.price },
		priceBreakDown: { basePrice, deliveryCharge, grandTotal },
		document: [
			{ docType: 'SELFIE', docLink: '', status: 'PENDING' },
			{ docType: 'SIGNATURE', docLink: '', status: 'PENDING' },
		],
		address,
		status: 'PENDING',
	};

	const bookings = await collection<Booking>('bookings');
	const res = await bookings.insertOne({ ...booking, _id: new ObjectId() } as any);
	return NextResponse.json({ ok: true, id: res.insertedId.toString() });
}
