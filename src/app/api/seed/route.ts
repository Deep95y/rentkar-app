// src/app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { collection, ensureIndexes } from '@/lib/db';
import type { Product } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function POST() {
	await ensureIndexes();
    const bookings = await collection('bookings');
    const partners = await collection('partners');
    const products = await collection<Product>('products');

    await partners.deleteMany({});
    await bookings.deleteMany({});
    await products.deleteMany({});

	await partners.insertMany([
		{ _id: new ObjectId(), name: 'Test Partner', city: 'mumbai', status: 'online', location: { lat: 19.2, lng: 72.82 } },
		{ _id: new ObjectId(), name: 'Near Partner', city: 'mumbai', status: 'online', location: { lat: 19.203, lng: 72.828 } },
		{ _id: new ObjectId(), name: 'Offline Partner', city: 'mumbai', status: 'offline', location: { lat: 19.18, lng: 72.8 } },
	]);

    // Seed products
    const seededProducts = [
        {
            _id: new ObjectId('685612cd3225791ecbb86b6e'),
            name: 'Basic Scooter',
            category: '2-wheeler',
            images: [],
            deposit: 1000,
            plans: [
                { durationDays: 1, price: 590 },
                { durationDays: 2, price: 1000 },
            ],
            city: 'mumbai',
            stock: 5,
            status: 'active',
        },
        {
            _id: new ObjectId('685612cd3225791ecbb86b6f'),
            name: 'Premium Scooter',
            category: '2-wheeler',
            images: [],
            deposit: 1500,
            plans: [
                { durationDays: 1, price: 790 },
                { durationDays: 2, price: 1400 },
            ],
            city: 'mumbai',
            stock: 3,
            status: 'active',
        },
    ] satisfies Product[];
    await products.insertMany(seededProducts as any);

    await bookings.insertMany([
		{
			_id: new ObjectId('687761e7c5bc4044c6d75cb3'),
			userId: new ObjectId('68108f18d1224f8f22316a7b'),
			packageId: new ObjectId('685612cd3225791ecbb86b6e'),
			startDate: '2025-07-19T00:00:00.000Z',
			endDate: '2025-07-20T00:00:00.000Z',
			isSelfPickup: false,
			location: 'mumbai',
			deliveryTime: { startHour: 12, endHour: 14 },
            selectedPlan: { duration: 1, price: 590 },
			priceBreakDown: { basePrice: 590, deliveryCharge: 250, grandTotal: 1580.02 },
			document: [
				{ docType: 'SELFIE', docLink: 'https://rentkar-testv1.s3.ap-south-1.amazonaws.com/user/selfie/sample.jpg', status: 'APPROVED' },
				{ docType: 'SIGNATURE', docLink: 'https://rentkar-testv1.s3.ap-south-1.amazonaws.com/user/signature/sample.jpg', status: 'APPROVED' },
			],
			address: {
				buildingAreaName: 'Pooja Enclave',
				houseNumber: 'A/603',
				streetAddress: 'Kandivali West, Mumbai',
				zip: '400067',
				latitude: 19.203258,
				longitude: 72.8278919,
			},
			status: 'PENDING',
        },
		{
			_id: new ObjectId('687761e7c5bc4044c6d75cb4'),
			userId: new ObjectId('68108f18d1224f8f22316a7c'),
			packageId: new ObjectId('685612cd3225791ecbb86b6f'),
			startDate: '2025-07-21T00:00:00.000Z',
			endDate: '2025-07-22T00:00:00.000Z',
			isSelfPickup: false,
			location: 'mumbai',
			deliveryTime: { startHour: 10, endHour: 12 },
            selectedPlan: { duration: 2, price: 1400 },
            priceBreakDown: { basePrice: 1400, deliveryCharge: 300, grandTotal: 2600 },
			document: [
				{ docType: 'SELFIE', docLink: 'https://rentkar-testv1.s3.ap-south-1.amazonaws.com/user/selfie/sample.jpg', status: 'APPROVED' },
				{ docType: 'SIGNATURE', docLink: 'https://rentkar-testv1.s3.ap-south-1.amazonaws.com/user/signature/sample.jpg', status: 'APPROVED' },
			],
			address: {
				buildingAreaName: 'Another',
				houseNumber: 'B/101',
				streetAddress: 'Andheri West, Mumbai',
				zip: '400053',
				latitude: 19.117,
				longitude: 72.846,
			},
			status: 'PENDING',
		},
	]);

	return NextResponse.json({ ok: true });
}
