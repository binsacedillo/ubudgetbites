import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch custom profile from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            ...userDocSnap.data()
          });
        } else {
          // Profile doc fallback (if user registered but doc creation is in progress)
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            campus: 'ust',
            favorites: { meals: [], stalls: [] },
            contributionsCount: 0,
            role: 'student'
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (name, email, password, campus) => {
    // 1. Create Auth credential
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // 2. Create Firestore profile document
    const userProfile = {
      name,
      email,
      campus,
      favorites: { meals: [], stalls: [] },
      contributionsCount: 0,
      role: 'student'
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const toggleFavorite = async (targetId, type) => {
    if (!user) return;
    
    const userDocRef = doc(db, 'users', user.id);
    const listKey = type === 'meal' ? 'favorites.meals' : 'favorites.stalls';
    const isFav = isFavorite(targetId, type);

    // Update in Firestore
    await updateDoc(userDocRef, {
      [listKey]: isFav ? arrayRemove(targetId) : arrayUnion(targetId)
    });

    // Update local state context
    setUser((prevUser) => {
      if (!prevUser) return null;
      const targetListKey = type === 'meal' ? 'meals' : 'stalls';
      const updatedList = isFav
        ? prevUser.favorites[targetListKey].filter((id) => id !== targetId)
        : [...prevUser.favorites[targetListKey], targetId];

      return {
        ...prevUser,
        favorites: {
          ...prevUser.favorites,
          [targetListKey]: updatedList
        }
      };
    });
  };

  const isFavorite = (targetId, type) => {
    if (!user || !user.favorites) return false;
    const list = type === 'meal' ? user.favorites.meals : user.favorites.stalls;
    return list ? list.includes(targetId) : false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, toggleFavorite, isFavorite }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
