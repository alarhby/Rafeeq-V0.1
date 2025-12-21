
export enum UserRole {
  PASSENGER = 'PASSENGER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN'
}

export enum VerificationStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export enum VehicleStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  avatar?: string;
}

export interface Vehicle {
  id: string;
  driverId: string;
  make: string;
  model: string;
  year: string;
  plateNumber: string;
  status: VehicleStatus;
  rejectionReason?: string;
  photos: {
    front: string;
    back: string;
    side: string;
  };
  documents: {
    license: string;
    idCard: string;
  };
}

export interface Trip {
  id: string;
  driverId: string;
  vehicleId: string;
  fromCountry: string;
  fromCity: string;
  toCountry: string;
  toCity: string;
  date: string;
  price: number;
  currency: 'SAR' | 'YER';
  seatsAvailable: number;
  seatsBooked: number;
  notes?: string;
  status: 'ACTIVE' | 'FULL' | 'CANCELLED';
}

export interface Shipment {
  id: string;
  userId: string;
  trackingNumber: string;
  title: string;
  type: string;
  weight: number;
  quantity: number;
  fromCity: string;
  toCity: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  date: string;
  status: 'PENDING' | 'OFFERED' | 'ACCEPTED' | 'DELIVERED';
  offersCount: number;
  description?: string;
  images: string[];
}

export interface ShipmentOffer {
  id: string;
  shipmentId: string;
  driverId: string;
  price: number;
  currency: 'SAR' | 'YER';
  travelDate: string;
  vehicleId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  notes?: string;
}
