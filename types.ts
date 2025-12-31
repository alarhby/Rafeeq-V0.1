
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
  createdAt?: any;
  updatedAt?: any;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'OFFER_RECEIVED' | 'OFFER_ACCEPTED' | 'OFFER_REJECTED' | 'SYSTEM';
  relatedId?: string;
  read: boolean;
  createdAt: any;
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
    registration: string;
    idCard: string;
  };
  createdAt?: any;
  updatedAt?: any;
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
  time: string;
  price: number;
  originalPrice?: number;
  currency: 'SAR' | 'YER';
  seatsAvailable: number;
  seatsBooked: number;
  notes?: string;
  status: 'ACTIVE' | 'FULL' | 'CANCELLED' | 'DELIVERED';
  cancellationReason?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Shipment {
  id: string;
  userId: string;
  trackingNumber: string;
  title: string;
  type: string;
  weight: number;
  quantity: number;
  fromCountry?: string;
  fromCity: string;
  senderAddress: string;
  toCountry?: string;
  toCity: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  date: string;
  status: 'PENDING' | 'OFFERED' | 'ACCEPTED' | 'DELIVERED';
  offersCount: number;
  description?: string;
  images: string[];
  createdAt?: any;
  updatedAt?: any;
}

export interface ShipmentOffer {
  id: string;
  shipmentId: string;
  driverId: string;
  driverName?: string;
  price: number;
  currency: 'SAR' | 'YER';
  travelDate?: string;
  vehicleId?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
}
