// src/app/admin/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import Link from "next/link";

interface UserData {
  id: string;
  email: string;
  fullName?: string;
  role: "user" | "admin";
  createdAt?: string;
  phone?: string;
}

export default function AdminUsers() {
  const { user, role, loading: authLoading } = useAuth("admin");
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "admin") return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList: UserData[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            email: data.email || "Unknown",
            fullName: data.fullName || "Not set",
            role: data.role || "user",
            createdAt: data.createdAt
              ? new Date(data.createdAt).toLocaleDateString()
              : "Unknown",
            phone: data.phone || "Not set",
          };
        });
        setUsers(usersList);
      } catch (err: any) {
        console.error("Users fetch error:", err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [role]);

  const changeRole = async (userId: string, newRole: "user" | "admin") => {
    if (!confirm(`Change role to ${newRole}?`)) return;

    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      toast.success(`Role updated to ${newRole}`);
    } catch (err: any) {
      toast.error("Failed to update role");
      console.error(err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Delete this user? This will remove their profile data but not their auth account.")) return;

    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("User deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete user");
      console.error(err);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading users...</p>
          </div>
        </main>
      </>
    );
  }

  if (role !== "admin") return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-cover bg-center bg-fixed relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=2000&q=80')`,
        }}
      >
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black/45"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
          {/* Back to Dashboard Link */}
          <Link href="/admin/dashboard" className="inline-flex items-center mb-8 text-white hover:text-brand-yellow transition">
            <span className="text-xl mr-2">←</span>
            <span className="font-medium">Back to Admin Dashboard</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-12 drop-shadow-lg">
            Manage All Users
          </h1>

          {users.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center">
              <p className="text-2xl text-gray-800">No users registered yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
                <thead className="bg-gray-100/90">
                  <tr>
                    <th className="px-6 py-5 text-left font-semibold text-gray-800">Email</th>
                    <th className="px-6 py-5 text-left font-semibold text-gray-800">Name</th>
                    <th className="px-6 py-5 text-left font-semibold text-gray-800">Phone</th>
                    <th className="px-6 py-5 text-left font-semibold text-gray-800">Joined</th>
                    <th className="px-6 py-5 text-left font-semibold text-gray-800">Role</th>
                    <th className="px-6 py-5 text-center font-semibold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-5">{u.email}</td>
                      <td className="px-6 py-5">{u.fullName}</td>
                      <td className="px-6 py-5">{u.phone}</td>
                      <td className="px-6 py-5">{u.createdAt}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            u.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center space-x-4">
                        <button
                          onClick={() => changeRole(u.id, u.role === "admin" ? "user" : "admin")}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {u.role === "admin" ? "Make User" : "Make Admin"}
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}