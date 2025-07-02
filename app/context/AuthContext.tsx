"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Our initialized auth object
import { Orbitron, Roboto } from 'next/font/google';

// 1. Define the shape of our context's value
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
};

// 2. Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged is a listener from Firebase.
    // It runs once when the component mounts, and then every time
    // the user's authentication state changes (login or logout).
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // If user logs in, the user object is passed. If logs out, it's null.
      setIsLoading(false); // We're done loading, we now know the auth state.
    });

    // Cleanup function: Unsubscribe from the listener when the component unmounts.
    // This is crucial to prevent memory leaks.
    return () => unsubscribe();
  }, []); // The empty dependency array means this effect runs only once on mount.

  const value = {
    user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 4. Create the custom hook for easy access to the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
