"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "@/types/User";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load users");
      const data: User[] = await res.json();
      setUsers(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="p-8 text-lg">Loading users…</p>;
  if (error) return <p className="p-8 text-red-600">Error: {error}</p>;

  return (
    <section className="p-8 min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-primary">User Management</h1>
      <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground mb-4 block">
        ← Back to Admin Home
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/30 backdrop-blur-md rounded-lg shadow-lg">
          <thead className="bg-white/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Email</th>
              <th className="px-4 py-2 text-left font-medium">Name</th>
              <th className="px-4 py-2 text-left font-medium">Role</th>
              <th className="px-4 py-2 text-center font-medium">Active</th>
              <th className="px-4 py-2 text-left font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-white/20 hover:bg-white/40 transition">
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.fullName}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2 text-center">
                  {user.isActive ? "✅" : "❌"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
