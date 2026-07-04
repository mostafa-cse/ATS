export interface User {
  id: string; // GUID as string
  email: string;
  fullName: string;
  role: string; // e.g., "Admin" or "Customer"
  isActive: boolean;
  createdAt: string; // ISO date string
}
