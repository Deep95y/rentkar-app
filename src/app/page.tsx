"use client";
import { useEffect, useMemo, useState } from 'react';

type Booking = {
	_id: string;
	status?: string;
	assignedPartnerId?: string | null;
};

type ServerEvent = MessageEvent<string>;

type Gps = { partnerId: string; lat: number; lng: number };

export default function Home() {
	const [bookings, setBookings] = useState<Booking[]>([]);
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

	useEffect(() => { load(); }, []);

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

	const gpsList = useMemo(() => Object.values(gps), [gps]);

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
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex gap-3">
				<button className="px-3 py-2 bg-black text-white rounded" onClick={seed}>Seed</button>
				<button className="px-3 py-2 border rounded" onClick={load} disabled={loading}>Refresh</button>
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
					{gpsList.map((g) => (
						<tr key={g.partnerId}>
							<td className="p-2 border font-mono">{g.partnerId}</td>
							<td className="p-2 border">{g.lat.toFixed(6)}</td>
							<td className="p-2 border">{g.lng.toFixed(6)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
