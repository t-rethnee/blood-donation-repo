import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Backend থেকে ইউজারের role ফেচ করার ফাংশন
  const fetchUserRole = async (email) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${email}`);
      if (!res.ok) throw new Error("Failed to fetch user role");
      const data = await res.json();
      return data.role || null; // role না থাকলে null রিটার্ন করো
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (loggedInUser) => {
      if (loggedInUser?.email) {
        setLoading(true);  // loading true করে নিচ্ছি ডাটা ফেচ করার সময়

        // backend থেকে role ফেচ করো
        const role = await fetchUserRole(loggedInUser.email);

        setUser({
          uid: loggedInUser.uid,
          email: loggedInUser.email,
          displayName: loggedInUser.displayName || "",
          photoURL: loggedInUser.photoURL || "",
          role: role || "donor",  // ডিফল্ট 'donor' যদি role না পাওয়া যায়
        });

        localStorage.setItem("userEmail", loggedInUser.email);
        setLoading(false);
      } else {
        setUser(null);
        localStorage.removeItem("userEmail");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Registration
  const createUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userEmail", result.user.email);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userEmail", result.user.email);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logoutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged এ user ও localStorage পরিষ্কার হবে
    } finally {
      setLoading(false);
    }
  };

  // Update Profile
  const updateUserProfile = async (profile) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, profile);
      const updatedUser = auth.currentUser;
      setUser((prevUser) => ({
        ...prevUser,
        displayName: updatedUser.displayName || "",
        photoURL: updatedUser.photoURL || "",
      }));
    }
  };

  const authInfo = {
    user,
    loading,
    createUser,
    loginUser,
    logoutUser,
    updateUserProfile,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
