export interface Order {
  id: string; // GUID as string
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string; // ISO date string
}
