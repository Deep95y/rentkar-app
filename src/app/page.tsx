"use client";
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

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
	const { user, loading: authLoading } = useAuth();
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

	// Show loading while checking authentication
	if (authLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	// Show landing page if not authenticated
	if (!user) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center py-12">
						<h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Rentkar</h1>
						<p className="text-xl text-gray-600 mb-8">Your trusted vehicle rental platform</p>
						<div className="flex justify-center space-x-4">
							<Link
								href="/auth/login"
								className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
							>
								Sign In
							</Link>
							<Link
								href="/auth/register"
								className="bg-white text-indigo-600 px-6 py-3 rounded-lg border border-indigo-600 hover:bg-indigo-50"
							>
								Sign Up
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Redirect authenticated users to their dashboard
	if (user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Redirecting to your dashboard...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<div className="flex gap-3">
					<button className="px-3 py-2 bg-black text-white rounded" onClick={seed}>Seed</button>
					<button className="px-3 py-2 border rounded" onClick={() => { load(); loadPartners(); }} disabled={loading}>Refresh</button>
				</div>
				<div className="flex gap-3">
					<a href="/products" className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">
						Manage Products
					</a>
				</div>
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
