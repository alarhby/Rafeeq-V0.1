import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  setDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { db, storage } from './firebase';
import { Trip, Shipment, Notification, Vehicle, VehicleStatus } from '../types';

// Helper to add a timeout to Firebase operations
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 20000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firebase operation timed out. Please check your connection and configuration.')), timeoutMs)
    )
  ]);
};

export const uploadImage = async (path: string, blob: Blob): Promise<string> => {
  const storageRef = ref(storage, path);
  const snapshot = await withTimeout(uploadBytes(storageRef, blob));
  return await getDownloadURL(snapshot.ref);
};


const mapDoc = (docSnap: any) => {
  if (!docSnap || !docSnap.exists()) return null;
  const data = docSnap.data();
  const id = docSnap.id;
  const result: any = { id };
  for (const key in data) {
    const val = data[key];
    if (val && typeof val === 'object' && typeof val.toDate === 'function') {
      result[key] = val.toDate().toISOString();
    } else {
      result[key] = val;
    }
  }
  return result;
};

const sortByCreatedAt = (data: any[]) => {
  return [...data].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });
};

// --- الإشعارات (Notifications) ---

export const createNotification = async (notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
  try {
    await addDoc(collection(db, 'notifications'), {
      ...notif,
      read: false,
      createdAt: serverTimestamp()
    });
  } catch (e) {
    console.error("Notification Error:", e);
  }
};

export const subscribeToMyNotifications = (userId: string, callback: (notifs: Notification[]) => void) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const notifs = snapshot.docs.map(mapDoc).filter(Boolean) as Notification[];
    callback(notifs);
  }, (err) => {
    console.error("Subscription Error:", err);
  });
};

export const markNotificationAsRead = async (notifId: string) => {
  await updateDoc(doc(db, 'notifications', notifId), { read: true });
};

// --- الرحلات (Trips) ---

export const createTrip = async (tripData: any) => {
  const data = {
    ...tripData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: 'ACTIVE',
    seatsBooked: 0,
    seatsAvailable: Number(tripData.seats) || 4
  };
  console.log("Creating trip in Firebase...", data);
  const tripRef = await withTimeout(addDoc(collection(db, 'trips'), data));
  console.log("Trip created successfully! ID:", tripRef.id);
  return { id: tripRef.id };
};

export const updateTrip = async (tripId: string, updates: Partial<Trip>) => {
  const tripRef = doc(db, 'trips', tripId);
  await updateDoc(tripRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const getTripDetails = async (tripId: string): Promise<Trip | null> => {
  const tripDoc = await getDoc(doc(db, 'trips', tripId));
  return mapDoc(tripDoc) as Trip;
};

export const subscribeToAllActiveTrips = (callback: (trips: Trip[]) => void) => {
  const q = query(collection(db, 'trips'), where('status', '==', 'ACTIVE'));
  return onSnapshot(q, (snapshot) => {
    const trips = snapshot.docs.map(mapDoc).filter(Boolean) as Trip[];
    callback(sortByCreatedAt(trips));
  });
};

export const subscribeToMyTrips = (driverId: string, callback: (trips: Trip[]) => void) => {
  const q = query(collection(db, 'trips'), where('driverId', '==', driverId));
  return onSnapshot(q, (snapshot) => {
    const trips = snapshot.docs.map(mapDoc).filter(Boolean) as Trip[];
    callback(sortByCreatedAt(trips));
  });
};

// --- الشحنات (Shipments) ---

export const createShipment = async (shipmentData: any) => {
  const data = {
    ...shipmentData,
    status: 'PENDING',
    offersCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  console.log("Creating shipment in Firebase...", data);
  const shipmentRef = await withTimeout(addDoc(collection(db, 'shipments'), data));
  console.log("Shipment created successfully! ID:", shipmentRef.id);
  return { id: shipmentRef.id };
};

export const subscribeToShipmentDetails = (shipmentId: string, callback: (shipment: Shipment | null) => void) => {
  return onSnapshot(doc(db, 'shipments', shipmentId), (docSnap) => {
    callback(mapDoc(docSnap) as Shipment);
  });
};

export const subscribeToAllPendingShipments = (callback: (shipments: Shipment[]) => void) => {
  const q = query(collection(db, 'shipments'), where('status', '==', 'PENDING'));
  return onSnapshot(q, (snapshot) => {
    const shipments = snapshot.docs.map(mapDoc).filter(Boolean) as Shipment[];
    callback(sortByCreatedAt(shipments));
  });
};

export const subscribeToMyShipments = (userId: string, callback: (shipments: Shipment[]) => void) => {
  const q = query(collection(db, 'shipments'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const shipments = snapshot.docs.map(mapDoc).filter(Boolean) as Shipment[];
    callback(sortByCreatedAt(shipments));
  });
};

export const subscribeToMyLastShipment = (userId: string, callback: (shipment: Shipment | null) => void) => {
  const q = query(collection(db, 'shipments'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const shipments = snapshot.docs.map(mapDoc).filter(Boolean) as Shipment[];
    const sorted = sortByCreatedAt(shipments);
    callback(sorted.length > 0 ? sorted[0] : null);
  });
};

// --- المفضلات والحجوزات ---

export const toggleFavorite = async (userId: string, tripId: string) => {
  const favId = `${userId}_${tripId}`;
  const favRef = doc(db, 'favorites', favId);
  const favDoc = await getDoc(favRef);
  if (favDoc.exists()) {
    await deleteDoc(favRef);
    return false;
  } else {
    await setDoc(favRef, { userId, tripId, createdAt: serverTimestamp() });
    return true;
  }
};

export const isTripFavorite = async (userId: string, tripId: string) => {
  const favDoc = await getDoc(doc(db, 'favorites', `${userId}_${tripId}`));
  return favDoc.exists();
};

export const subscribeToMyFavorites = (userId: string, callback: (trips: Trip[]) => void) => {
  const q = query(collection(db, 'favorites'), where('userId', '==', userId));
  return onSnapshot(q, async (snapshot) => {
    const favs = snapshot.docs.map(doc => doc.data().tripId);
    if (favs.length === 0) return callback([]);
    const trips: Trip[] = [];
    for (const tripId of favs) {
      const tripDoc = await getDoc(doc(db, 'trips', tripId));
      const mapped = mapDoc(tripDoc);
      if (mapped) trips.push(mapped as Trip);
    }
    callback(trips);
  });
};

export const subscribeToMyLastBooking = (userId: string, callback: (booking: any | null) => void) => {
  const q = query(collection(db, 'bookings'), where('userId', '==', userId));
  return onSnapshot(q, async (snapshot) => {
    const bookings = snapshot.docs.map(mapDoc).filter(Boolean);
    const sorted = sortByCreatedAt(bookings);
    if (sorted.length > 0) {
      const lastBooking = sorted[0];
      const tripDoc = await getDoc(doc(db, 'trips', lastBooking.tripId));
      callback({ ...lastBooking, tripDetails: mapDoc(tripDoc) });
    } else {
      callback(null);
    }
  });
};

// --- العروض (Offers) ---

export const upsertOffer = async (offerData: any) => {
  const offerId = `${offerData.driverId}_${offerData.shipmentId}`;
  const offerRef = doc(db, 'offers', offerId);
  const offerDoc = await getDoc(offerRef);
  const isNew = !offerDoc.exists();

  await setDoc(offerRef, { ...offerData, id: offerId, updatedAt: serverTimestamp() }, { merge: true });

  const shipmentRef = doc(db, 'shipments', offerData.shipmentId);
  const shipmentDoc = await getDoc(shipmentRef);

  if (shipmentDoc.exists()) {
    const sData = shipmentDoc.data();
    await updateDoc(shipmentRef, { offersCount: (sData.offersCount || 0) + (isNew ? 1 : 0) });

    // إرسال إشعار لصاحب الشحنة
    if (isNew) {
      await createNotification({
        userId: sData.userId,
        title: 'عرض سعر جديد',
        message: `لقد تلقيت عرض سعر جديد بقيمة ${offerData.price} ر.س على شحنتك: ${sData.title}`,
        type: 'OFFER_RECEIVED',
        relatedId: offerData.shipmentId
      });
    }
  }
  return { id: offerId };
};

export const getDriverOfferForShipment = async (driverId: string, shipmentId: string): Promise<any | null> => {
  const offerDoc = await getDoc(doc(db, 'offers', `${driverId}_${shipmentId}`));
  return mapDoc(offerDoc);
};

export const subscribeToShipmentOffers = (shipmentId: string, callback: (offers: any[]) => void) => {
  const q = query(collection(db, 'offers'), where('shipmentId', '==', shipmentId));
  return onSnapshot(q, (snapshot) => {
    const offers = snapshot.docs.map(mapDoc).filter(Boolean);
    const sortedOffers = [...offers].filter(o => o.status !== 'REJECTED').sort((a, b) => (a.price || 0) - (b.price || 0));
    callback(sortedOffers);
  });
};

export const acceptOffer = async (shipmentId: string, offerId: string) => {
  const shipmentRef = doc(db, 'shipments', shipmentId);
  const offerRef = doc(db, 'offers', offerId);

  const sDoc = await getDoc(shipmentRef);
  const oDoc = await getDoc(offerRef);

  await updateDoc(shipmentRef, {
    status: 'ACCEPTED',
    acceptedOfferId: offerId,
    updatedAt: serverTimestamp()
  });

  await updateDoc(offerRef, {
    status: 'ACCEPTED',
    updatedAt: serverTimestamp()
  });

  // إرسال إشعار للسائق
  if (sDoc.exists() && oDoc.exists()) {
    await createNotification({
      userId: oDoc.data()?.driverId,
      title: 'تم قبول عرضك!',
      message: `تم قبول عرضك لشحن "${sDoc.data()?.title}". يرجى البدء في إجراءات الشحن.`,
      type: 'OFFER_ACCEPTED',
      relatedId: shipmentId
    });
  }
};

export const rejectOffer = async (offerId: string) => {
  const offerRef = doc(db, 'offers', offerId);
  const oDoc = await getDoc(offerRef);

  await updateDoc(offerRef, {
    status: 'REJECTED',
    updatedAt: serverTimestamp()
  });

  // إرسال إشعار للسائق
  if (oDoc.exists()) {
    const shipmentDoc = await getDoc(doc(db, 'shipments', oDoc.data()?.shipmentId));
    await createNotification({
      userId: oDoc.data()?.driverId,
      title: 'تم رفض عرضك',
      message: `تم رفض عرض السعر المقدم لشحنة "${shipmentDoc.data()?.title}".`,
      type: 'OFFER_REJECTED',
      relatedId: oDoc.data()?.shipmentId
    });
  }
};

// --- المركبات (Vehicles) ---

export const createVehicle = async (vehicleData: any) => {
  const data = {
    ...vehicleData,
    status: VehicleStatus.PENDING,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const vehicleRef = await withTimeout(addDoc(collection(db, 'vehicles'), data));
  return { id: vehicleRef.id };
};

export const subscribeToMyVehicles = (driverId: string, callback: (vehicles: Vehicle[]) => void) => {
  const q = query(collection(db, 'vehicles'), where('driverId', '==', driverId));
  return onSnapshot(q, (snapshot) => {
    const vehicles = snapshot.docs.map(mapDoc).filter(Boolean) as Vehicle[];
    callback(sortByCreatedAt(vehicles));
  });
};