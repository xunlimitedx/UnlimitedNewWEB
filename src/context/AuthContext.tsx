'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, type User } from '@/lib/firebase';
import { getDocument, setDocument } from '@/lib/firebase';
import { isAdmin } from '@/lib/utils';
import type { UserProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdminUser: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isAdminUser: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Fetch or create user profile
        const profile = await getDocument('users', firebaseUser.uid);
        if (profile) {
          setUserProfile(profile as unknown as UserProfile);
        } else {
          // Create profile for new Google sign-in users
          const newProfile: Omit<UserProfile, 'id'> = {
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            ...(firebaseUser.photoURL ? { photoURL: firebaseUser.photoURL } : {}),
            addresses: [],
            createdAt: new Date().toISOString(),
          };
          setDocument('users', firebaseUser.uid, newProfile).catch(console.error);
          setUserProfile({ id: firebaseUser.uid, ...newProfile });

          // Notify admin of new signup (fire-and-forget)
          fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'new-signup',
              data: {
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || '',
                provider: firebaseUser.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Email',
              },
            }),
          }).catch(() => {}); // silent fail
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAdminUser: isAdmin(user?.email),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
