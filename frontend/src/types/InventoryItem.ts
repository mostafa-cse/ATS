export interface InventoryItem {
  id: string; // GUID as string
  sku: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
}
