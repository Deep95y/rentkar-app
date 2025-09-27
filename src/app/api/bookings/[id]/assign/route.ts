// src/app/api/bookings/[id]/assign/route.ts
import { NextResponse } from 'next/server';
import { collection } from '@/lib/db';
import { withLock } from '@/lib/redis';
import type { Booking, Partner } from '@/lib/types';
import { ObjectId } from 'mongodb';

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const sa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(sa), Math.sqrt(1 - sa));
  return R * c;
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: bookingId } = await params;

  try {
    const result = await withLock(`booking:${bookingId}:assign`, 5000, async () => {
      const bookings = await collection<Booking>('bookings');
      const partners = await collection<Partner>('partners');

      const booking = await bookings.findOne({ _id: new ObjectId(bookingId) });
      if (!booking) return { error: 'NOT_FOUND' as const };
      if (booking.assignedPartnerId) return { error: 'ALREADY_ASSIGNED' as const };

      const onlinePartners = await partners.find({ status: 'online' }).toArray();
      if (onlinePartners.length === 0) return { error: 'NO_ONLINE_PARTNER' as const };

      const origin = { lat: booking.address.latitude, lng: booking.address.longitude };
      let chosen = onlinePartners[0];
      let best = haversineKm(origin, onlinePartners[0].location);
      for (const p of onlinePartners.slice(1)) {
        const d = haversineKm(origin, p.location);
        if (d < best) {
          best = d;
          chosen = p;
        }
      }

      const updated = await bookings.updateOne(
        { _id: new ObjectId(bookingId), assignedPartnerId: { $in: [null, undefined] } },
        { $set: { assignedPartnerId: chosen._id.toString(), status: 'ASSIGNED' } }
      );
      if (updated.modifiedCount === 0) return { error: 'CONFLICT' as const };
      return { ok: true as const, partnerId: chosen._id.toString() };
    });

    if ('error' in result) return NextResponse.json(result, { status: 409 });
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof Error && e.message === 'LOCK_NOT_ACQUIRED')
      return NextResponse.json({ error: 'LOCK_BUSY' }, { status: 423 });
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}
