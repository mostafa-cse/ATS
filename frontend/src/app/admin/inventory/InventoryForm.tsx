"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InventoryItem } from "@/types/InventoryItem";

interface InventoryFormProps {
  initialData?: InventoryItem;
  onClose: () => void;
  onSubmit: (data: InventoryItem) => void;
}

// Zod schema for validation
const schema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be non‑negative"),
  stock: z.number().int().min(0, "Stock must be a non‑negative integer"),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function InventoryForm({ initialData, onClose, onSubmit }: InventoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      sku: initialData.sku,
      name: initialData.name,
      price: initialData.price,
      stock: initialData.stock,
      isActive: initialData.isActive,
    } : {
      sku: "",
      name: "",
      price: 0,
      stock: 0,
      isActive: true,
    },
  });

  const submitHandler = (data: FormValues) => {
    const payload: InventoryItem = {
      id: initialData?.id ?? crypto.randomUUID(),
      ...data,
    };
    onSubmit(payload);
    reset();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-lg z-50">
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg w-full max-w-md p-6 mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-primary">
          {initialData ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="sku">SKU</label>
            <input
              id="sku"
              {...register("sku")}
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.sku && <p className="text-sm text-red-600 mt-1">{errors.sku.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              {...register("name")}
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="stock">Stock</label>
              <input
                id="stock"
                type="number"
                {...register("stock", { valueAsNumber: true })}
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.stock && <p className="text-sm text-red-600 mt-1">{errors.stock.message}</p>}
            </div>
          </div>
          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              {...register("isActive")}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium">Active</label>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
