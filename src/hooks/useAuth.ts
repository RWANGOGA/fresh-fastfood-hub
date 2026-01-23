// src/hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export function useAuth(requiredRole?: "user" | "admin") {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Don't set loading to true again - this causes the flash!
      // setLoading(true); // ❌ REMOVE THIS LINE

      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        
        if (requiredRole && !hasChecked) {
          setHasChecked(true);
          toast.error("Please login first");
          router.replace("/login");
        }
        return;
      }

      setUser(firebaseUser);

      try {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const fetchedRole = userDoc.exists() ? userDoc.data()?.role || "user" : "user";
        setRole(fetchedRole);

        // Only redirect once after initial check
        if (requiredRole && fetchedRole !== requiredRole && !hasChecked) {
          setHasChecked(true);
          toast.error("Access denied – you don't have admin privileges");
          router.replace(fetchedRole === "admin" ? "/admin/dashboard" : "/");
        }
      } catch (err) {
        console.error("Error fetching role:", err);
        setRole("user");
        
        if (requiredRole && !hasChecked) {
          setHasChecked(true);
          toast.error("Access denied – role check failed");
          router.replace("/");
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, requiredRole, hasChecked]);

  return { user, role, loading };
}