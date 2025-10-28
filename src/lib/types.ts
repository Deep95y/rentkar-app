// src/lib/types.ts
import { ObjectId } from 'mongodb';

export type DocumentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type UserRole = 'CUSTOMER' | 'ADMIN' | 'PARTNER';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface BookingDocument {
	docType: 'SELFIE' | 'SIGNATURE' | string;
	docLink: string;
	status: DocumentStatus;
}

export interface Address {
	buildingAreaName: string;
	houseNumber: string;
	streetAddress: string;
	zip: string;
	latitude: number;
	longitude: number;
}

export interface Booking {
	_id?: string | ObjectId;
	userId: string | ObjectId;
	packageId: string | ObjectId;
	startDate: string;
	endDate: string;
	isSelfPickup: boolean;
	location: string;
	deliveryTime: { startHour: number; endHour: number };
	selectedPlan: { duration: number; price: number };
	priceBreakDown: { basePrice: number; deliveryCharge: number; grandTotal: number };
	document: BookingDocument[];
	address: Address;
	assignedPartnerId?: string | null;
	status?: 'PENDING' | 'ASSIGNED' | 'CONFIRMED' | 'CANCELLED';
}

export interface User {
	_id?: string | ObjectId;
	email: string;
	password: string; // hashed
	role: UserRole;
	profile: {
		name: string;
		phone?: string;
		city?: string;
	};
	status: UserStatus;
	createdAt: string;
	lastLoginAt?: string;
}

export interface Partner {
	_id: string | ObjectId;
	name: string;
	city: string;
	status: 'online' | 'offline';
	location: { lat: number; lng: number };
	lastGpsAt?: string;
	userId?: string | ObjectId; // Link to User account
}

export interface ProductPlan {
	durationDays: number;
	price: number;
}

export interface Product {
	_id?: string | ObjectId;
	name: string;
	category?: string;
	images?: string[];
	deposit?: number;
	plans: ProductPlan[];
	city?: string;
	stock?: number;
	status?: 'active' | 'inactive';
}
