import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, UserRole, VerificationStatus } from '../types';

export const loginUser = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Fetch additional user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
        throw new Error('User data not found');
    }

    return {
        id: firebaseUser.uid,
        ...userDoc.data()
    } as User;
};

export const registerUser = async (email: string, password: string, userData: Partial<User>): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const newUser: User = {
        id: firebaseUser.uid,
        name: userData.name || '',
        phone: userData.phone || '',
        role: userData.role || UserRole.PASSENGER,
        isVerified: false,
        verificationStatus: VerificationStatus.NONE,
        createdAt: new Date().toISOString()
    } as any;

    await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...newUser,
        updatedAt: serverTimestamp()
    });

    return newUser;
};

export const logoutUser = async () => {
    await signOut(auth);
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
                callback({
                    id: firebaseUser.uid,
                    ...userDoc.data()
                } as User);
            } else {
                callback(null);
            }
        } else {
            callback(null);
        }
    });
};
export const updateUserProfile = async (uid: string, updates: Partial<User>) => {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
    }, { merge: true });
};
