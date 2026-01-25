// src/hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export function useAuth(requiredRole?: "user" | "admin") {
  const router = useRouter();
  const pathname = usePathname(); // Get current page path
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        // Only redirect if the page requires auth
        if (requiredRole || pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
          toast.error("Please login first");
          router.replace("/login");
        }
        setLoading(false);
        return;
      }

      setUser(firebaseUser);

      try {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const fetchedRole = userDoc.exists() ? userDoc.data()?.role || "user" : "user";
        setRole(fetchedRole);

        // Only redirect if role doesn't match requirement
        if (requiredRole && fetchedRole !== requiredRole) {
          toast.error("Access denied – wrong privileges");
          router.replace(fetchedRole === "admin" ? "/admin/dashboard" : "/dashboard");
        }

        // Auto-redirect after login (only from login page)
        if (pathname === "/login" || pathname === "/signup") {
          if (fetchedRole === "admin") {
            router.replace("/admin/dashboard");
          } else {
            router.replace("/dashboard");
          }
        }
      } catch (err) {
        console.error("Role fetch error:", err);
        setRole("user");
        if (requiredRole) {
          toast.error("Access denied – role check failed");
          router.replace("/dashboard");
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, requiredRole, pathname]);

  return { user, role, loading };
}