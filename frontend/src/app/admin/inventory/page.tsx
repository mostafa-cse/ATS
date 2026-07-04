// src/app/admin/inventory/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { InventoryItem } from "@/types/InventoryItem";
import InventoryForm from "./InventoryForm";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";

const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/inventory");
      if (!res.ok) throw new Error("Failed to load inventory");
      const data: InventoryItem[] = await res.json();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async (newItem: Omit<InventoryItem, "id">) => {
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Create failed");
      await fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg text-white hover:bg-white/20 transition"
            onClick={() => setShowModal(true)}
          >
            <PlusIcon className="w-5 h-5" /> Add Item
          </button>
        </header>

        {loading ? (
          <p className="text-white">Loading…</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg backdrop-filter backdrop-blur-lg bg-white/5">
            <table className="min-w-full divide-y divide-white/20">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">SKU</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-white">Name</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-white">Price</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-white">Stock</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-white">Active</th>
                </tr>
              </thead>
              <tbody className="bg-white/5">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/10 transition">
                    <td className="px-4 py-2 text-sm text-white">{item.sku}</td>
                    <td className="px-4 py-2 text-sm text-white">{item.name}</td>
                    <td className="px-4 py-2 text-sm text-right text-white">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm text-right text-white">{item.stock}</td>
                    <td className="px-4 py-2 text-sm text-center text-white">
                      {item.isActive ? "✅" : "❌"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="relative w-full max-w-md mx-4 p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl animate-fade-in">
            <button
              className="absolute top-3 right-3 text-white hover:text-gray-300"
              onClick={() => setShowModal(false)}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <InventoryForm onSubmit={handleAdd} onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </section>
  );
};

export default InventoryPage;
