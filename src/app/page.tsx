"use client";
import { useEffect, useMemo, useState } from 'react';

type Booking = {
	_id: string;
	status?: string;
	assignedPartnerId?: string | null;
};

type ServerEvent = MessageEvent<string>;

type Gps = { partnerId: string; lat: number; lng: number };

type Partner = {
	_id: string;
	name: string;
	city: string;
	status: 'online' | 'offline';
	location: { lat: number; lng: number };
	lastGpsAt?: string;
};

export default function Home() {
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [partners, setPartners] = useState<Partner[]>([]);
	const [gps, setGps] = useState<Record<string, Gps>>({});
	const [loading, setLoading] = useState(false);

	const load = async () => {
		try {
			const res = await fetch('/api/bookings');
			if (!res.ok) { setBookings([]); return; }
			const text = await res.text();
			if (!text) { setBookings([]); return; }
			const data = JSON.parse(text) as Booking[];
			setBookings(Array.isArray(data) ? data : []);
		} catch {
			setBookings([]);
		} 
	};

	const loadPartners = async () => {
		try {
			const res = await fetch('/api/partners');
			if (!res.ok) { setPartners([]); return; }
			const text = await res.text();
			if (!text) { setPartners([]); return; }
			const data = JSON.parse(text) as Partner[];
			setPartners(Array.isArray(data) ? data : []);
		} catch {
			setPartners([]);
		}
	};

	useEffect(() => { 
		load(); 
		loadPartners();
	}, []);

	useEffect(() => {
		const es = new EventSource('/api/events');
		es.addEventListener('booking-confirmed', () => { load(); });
		es.addEventListener('partner-gps', (e: Event) => {
			const me = e as ServerEvent;
			try {
				const data = JSON.parse(me.data) as Gps;
				setGps((curr) => ({ ...curr, [data.partnerId]: data }));
			} catch { /* ignore */ }
		});
		return () => es.close();
	}, []);

	const gpsList = useMemo(() => {
		// Combine static partner data with live GPS updates
		const combined = [...partners];
		
		// Update with live GPS data if available
		Object.values(gps).forEach(liveGps => {
			const partnerIndex = combined.findIndex(p => p._id === liveGps.partnerId);
			if (partnerIndex >= 0) {
				combined[partnerIndex] = {
					...combined[partnerIndex],
					location: { lat: liveGps.lat, lng: liveGps.lng },
					lastGpsAt: new Date().toISOString()
				};
			}
		});
		
		return combined;
	}, [partners, gps]);

	const doAssign = async (id: string) => {
		setLoading(true);
		try {
			await fetch(`/api/bookings/${id}/assign`, { method: 'POST' });
			await load();
		} finally { setLoading(false); }
	};
	const doConfirm = async (id: string) => {
		setLoading(true);
		try {
			await fetch(`/api/bookings/${id}/confirm`, { method: 'POST' });
			await load();
		} finally { setLoading(false); }
	};

	const seed = async () => {
		await fetch('/api/seed', { method: 'POST' });
		await load();
		await loadPartners();
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex gap-3">
				<button className="px-3 py-2 bg-black text-white rounded" onClick={seed}>Seed</button>
				<button className="px-3 py-2 border rounded" onClick={() => { load(); loadPartners(); }} disabled={loading}>Refresh</button>
			</div>
			<h2 className="text-xl font-semibold">Bookings</h2>
			<table className="w-full text-sm border">
			<thead>
					<tr className="bg-blue-900 text-white">
						<th className="p-2 border border-blue-800">ID</th>
						<th className="p-2 border border-blue-800">Status</th>
						<th className="p-2 border border-blue-800">Assigned Partner</th>
						<th className="p-2 border border-blue-800">Actions</th>
					</tr>
					</thead>
				<tbody>
					{bookings.map((b) => (
						<tr key={b._id}>
							<td className="p-2 border font-mono">{b._id}</td>
							<td className="p-2 border">{b.status || 'PENDING'}</td>
							<td className="p-2 border">{b.assignedPartnerId || '-'}</td>
							<td className="p-2 border">
								<div className="flex gap-2">
									<button className="px-2 py-1 border rounded" onClick={() => doAssign(b._id)} disabled={loading}>Assign</button>
									<button className="px-2 py-1 border rounded" onClick={() => doConfirm(b._id)} disabled={loading}>Confirm</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<h2 className="text-xl font-semibold">Partner GPS (live)</h2>
			<table className="w-full text-sm border">
				<thead>
					<tr className="bg-blue-900 text-white">
						<th className="p-2 border border-blue-800">Partner</th>
						<th className="p-2 border border-blue-800">Lat</th>
						<th className="p-2 border border-blue-800">Lng</th>
					</tr>
				</thead>
				<tbody>
					{gpsList.map((partner) => (
						<tr key={partner._id}>
							<td className="p-2 border font-mono">{partner.name} ({partner._id.slice(-6)})</td>
							<td className="p-2 border">{partner.location.lat.toFixed(6)}</td>
							<td className="p-2 border">{partner.location.lng.toFixed(6)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
