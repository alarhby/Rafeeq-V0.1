import { Trip, Shipment, ShipmentOffer } from '../types';

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- الرحلات (Trips) ---
export const createTrip = async (tripData: any) => {
  await delay(500);
  const newTrip = {
    ...tripData,
    id: 't-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'ACTIVE'
  };
  const trips = JSON.parse(localStorage.getItem('rafiq_trips') || '[]');
  trips.unshift(newTrip);
  localStorage.setItem('rafiq_trips', JSON.stringify(trips));
  return { id: newTrip.id };
};

export const subscribeToTrips = (callback: (trips: Trip[]) => void) => {
  const loadTrips = () => {
    const savedTrips = JSON.parse(localStorage.getItem('rafiq_trips') || '[]');
    callback(savedTrips);
  };
  
  loadTrips();
  // Poll for changes every 2 seconds to simulate subscription
  const interval = setInterval(loadTrips, 2000);
  return () => clearInterval(interval);
};

// --- الشحنات (Shipments) ---
export const createShipment = async (shipmentData: any) => {
  await delay(500);
   const newShipment = {
    ...shipmentData,
    id: 's-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'PENDING',
    offersCount: 0
  };
  const shipments = JSON.parse(localStorage.getItem('rafiq_shipments') || '[]');
  shipments.unshift(newShipment);
  localStorage.setItem('rafiq_shipments', JSON.stringify(shipments));
  return { id: newShipment.id };
};

export const subscribeToShipments = (callback: (shipments: Shipment[]) => void) => {
   const loadShipments = () => {
    const saved = JSON.parse(localStorage.getItem('rafiq_shipments') || '[]');
    callback(saved);
  };
  loadShipments();
  const interval = setInterval(loadShipments, 2000);
  return () => clearInterval(interval);
};

// --- العروض (Offers) ---
export const submitOffer = async (offerData: any) => {
  await delay(500);
  const offers = JSON.parse(localStorage.getItem('rafiq_offers') || '[]');
  const newOffer = {
      ...offerData,
      id: 'o-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'PENDING'
  };
  offers.push(newOffer);
  localStorage.setItem('rafiq_offers', JSON.stringify(offers));
  
  // Update shipment offer count
  const shipments = JSON.parse(localStorage.getItem('rafiq_shipments') || '[]');
  const updatedShipments = shipments.map((s: any) => {
      if (s.id === offerData.shipmentId) {
          return { ...s, offersCount: (s.offersCount || 0) + 1 };
      }
      return s;
  });
  localStorage.setItem('rafiq_shipments', JSON.stringify(updatedShipments));
  
  return { id: newOffer.id };
};