"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Product = {
	_id: string;
	name: string;
	category?: string;
	images?: string[];
	deposit?: number;
	plans: { durationDays: number; price: number }[];
	city?: string;
	stock?: number;
	status?: 'active' | 'inactive';
};

type BookingForm = {
	userId: string;
	packageId: string;
	planDurationDays: number;
	startDate: string;
	endDate: string;
	isSelfPickup: boolean;
	location: string;
	deliveryTime: { startHour: number; endHour: number };
	address: {
		buildingAreaName: string;
		houseNumber: string;
		streetAddress: string;
		zip: string;
		latitude: number;
		longitude: number;
	};
};

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	const [showBookingForm, setShowBookingForm] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [bookingForm, setBookingForm] = useState<BookingForm>({
		userId: '68108f18d1224f8f22316a7b', // Default test user
		packageId: '',
		planDurationDays: 1,
		startDate: '',
		endDate: '',
		isSelfPickup: false,
		location: 'mumbai',
		deliveryTime: { startHour: 10, endHour: 12 },
		address: {
			buildingAreaName: '',
			houseNumber: '',
			streetAddress: '',
			zip: '',
			latitude: 19.203258,
			longitude: 72.8278919,
		}
	});

	const loadProducts = async () => {
		setLoading(true);
		try {
			const res = await fetch('/api/products');
			if (!res.ok) { setProducts([]); return; }
			const text = await res.text();
			if (!text) { setProducts([]); return; }
			const data = JSON.parse(text) as Product[];
			setProducts(Array.isArray(data) ? data : []);
		} catch {
			setProducts([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadProducts();
	}, []);

	const handleCreateBooking = (product: Product) => {
		setSelectedProduct(product);
		setBookingForm(prev => ({
			...prev,
			packageId: product._id,
			planDurationDays: product.plans[0]?.durationDays || 1
		}));
		setShowBookingForm(true);
	};

	const submitBooking = async () => {
		if (!selectedProduct) return;
		
		setLoading(true);
		try {
			const res = await fetch('/api/bookings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(bookingForm)
			});
			
			if (res.ok) {
				alert('Booking created successfully!');
				setShowBookingForm(false);
				setSelectedProduct(null);
			} else {
				const error = await res.json();
				alert(`Error: ${error.error || 'Failed to create booking'}`);
			}
		} catch (error) {
			alert('Failed to create booking');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<div className="flex gap-3">
					<Link href="/" className="px-3 py-2 border rounded hover:bg-gray-50">
						← Back to Dashboard
					</Link>
					<button 
						className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" 
						onClick={loadProducts}
						disabled={loading}
					>
						Refresh
					</button>
				</div>
				<h1 className="text-2xl font-bold">Products Management</h1>
			</div>

			{/* Products Table */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Available Products</h2>
				<table className="w-full text-sm border">
					<thead>
						<tr className="bg-green-900 text-white">
							<th className="p-3 border border-green-800">Name</th>
							<th className="p-3 border border-green-800">Category</th>
							<th className="p-3 border border-green-800">Plans</th>
							<th className="p-3 border border-green-800">Deposit</th>
							<th className="p-3 border border-green-800">Stock</th>
							<th className="p-3 border border-green-800">Status</th>
							<th className="p-3 border border-green-800">Actions</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => (
							<tr key={product._id}>
								<td className="p-3 border font-medium">{product.name}</td>
								<td className="p-3 border">{product.category || '-'}</td>
								<td className="p-3 border">
									<div className="space-y-1">
										{product.plans.map((plan, idx) => (
											<div key={idx} className="text-xs">
												{plan.durationDays} day(s) - ₹{plan.price}
											</div>
										))}
									</div>
								</td>
								<td className="p-3 border">₹{product.deposit || 0}</td>
								<td className="p-3 border">{product.stock || 0}</td>
								<td className="p-3 border">
									<span className={`px-2 py-1 rounded text-xs ${
										product.status === 'active' 
											? 'bg-green-100 text-green-800' 
											: 'bg-gray-100 text-gray-800'
									}`}>
										{product.status || 'active'}
									</span>
								</td>
								<td className="p-3 border">
									<button 
										className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
										onClick={() => handleCreateBooking(product)}
										disabled={loading}
									>
										Create Booking
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Booking Form Modal */}
			{showBookingForm && selectedProduct && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
						{/* Close button (X) in top-right corner */}
						<button
							onClick={() => {
								setShowBookingForm(false);
								setSelectedProduct(null);
							}}
							className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
						>
							×
						</button>
						
						<h3 className="text-xl font-semibold mb-4 text-gray-900 pr-8">
							Create Booking for {selectedProduct.name}
						</h3>
						
						<div className="space-y-4">
							{/* Product Info */}
							<div className="bg-gray-50 p-4 rounded">
								<h4 className="font-medium mb-2 text-gray-900">Product Details</h4>
								<p className="text-gray-900"><strong>Name:</strong> {selectedProduct.name}</p>
								<p className="text-gray-900"><strong>Category:</strong> {selectedProduct.category || 'N/A'}</p>
								<p className="text-gray-900"><strong>Deposit:</strong> ₹{selectedProduct.deposit || 0}</p>
								<p className="text-gray-900"><strong>Available Plans:</strong></p>
								<ul className="ml-4">
									{selectedProduct.plans.map((plan, idx) => (
										<li key={idx} className="text-sm text-gray-900">
											{plan.durationDays} day(s) - ₹{plan.price}
										</li>
									))}
								</ul>
							</div>

							{/* Booking Form */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium mb-1 text-gray-900">User ID</label>
									<input
										type="text"
										value={bookingForm.userId}
										onChange={(e) => setBookingForm(prev => ({ ...prev, userId: e.target.value }))}
										className="w-full p-2 border rounded text-gray-900"
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium mb-1 text-gray-900">Plan Duration (days)</label>
									<select
										value={bookingForm.planDurationDays}
										onChange={(e) => setBookingForm(prev => ({ ...prev, planDurationDays: Number(e.target.value) }))}
										className="w-full p-2 border rounded text-gray-900"
									>
										{selectedProduct.plans.map((plan, idx) => (
											<option key={idx} value={plan.durationDays}>
												{plan.durationDays} day(s) - ₹{plan.price}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium mb-1 text-gray-900">Start Date</label>
									<input
										type="date"
										value={bookingForm.startDate}
										onChange={(e) => setBookingForm(prev => ({ ...prev, startDate: e.target.value }))}
										className="w-full p-2 border rounded text-gray-900"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-1 text-gray-900">End Date</label>
									<input
										type="date"
										value={bookingForm.endDate}
										onChange={(e) => setBookingForm(prev => ({ ...prev, endDate: e.target.value }))}
										className="w-full p-2 border rounded text-gray-900"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-1 text-gray-900">Location</label>
									<input
										type="text"
										value={bookingForm.location}
										onChange={(e) => setBookingForm(prev => ({ ...prev, location: e.target.value }))}
										className="w-full p-2 border rounded text-gray-900"
									/>
								</div>

								<div className="flex items-center">
									<input
										type="checkbox"
										id="selfPickup"
										checked={bookingForm.isSelfPickup}
										onChange={(e) => setBookingForm(prev => ({ ...prev, isSelfPickup: e.target.checked }))}
										className="mr-2"
									/>
									<label htmlFor="selfPickup" className="text-sm font-medium text-gray-900">Self Pickup</label>
								</div>
							</div>

							{/* Address Section */}
							<div className="space-y-3">
								<h4 className="font-medium text-gray-900">Delivery Address</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium mb-1 text-gray-900">Building/Area Name</label>
										<input
											type="text"
											value={bookingForm.address.buildingAreaName}
											onChange={(e) => setBookingForm(prev => ({ 
												...prev, 
												address: { ...prev.address, buildingAreaName: e.target.value }
											}))}
											className="w-full p-2 border rounded text-gray-900"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-1 text-gray-900">House Number</label>
										<input
											type="text"
											value={bookingForm.address.houseNumber}
											onChange={(e) => setBookingForm(prev => ({ 
												...prev, 
												address: { ...prev.address, houseNumber: e.target.value }
											}))}
											className="w-full p-2 border rounded text-gray-900"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-1 text-gray-900">Street Address</label>
										<input
											type="text"
											value={bookingForm.address.streetAddress}
											onChange={(e) => setBookingForm(prev => ({ 
												...prev, 
												address: { ...prev.address, streetAddress: e.target.value }
											}))}
											className="w-full p-2 border rounded text-gray-900"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-1 text-gray-900">ZIP Code</label>
										<input
											type="text"
											value={bookingForm.address.zip}
											onChange={(e) => setBookingForm(prev => ({ 
												...prev, 
												address: { ...prev.address, zip: e.target.value }
											}))}
											className="w-full p-2 border rounded text-gray-900"
										/>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3 pt-4">
								<button
									onClick={submitBooking}
									disabled={loading}
									className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
								>
									{loading ? 'Creating...' : 'Create Booking'}
								</button>
								<button
									onClick={() => {
										setShowBookingForm(false);
										setSelectedProduct(null);
									}}
									className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 hover:border-gray-400"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}


