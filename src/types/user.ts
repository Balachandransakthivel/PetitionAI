export type UserRole = "citizen" | "officer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  department?: string;
  joinedAt: string;
  avatar?: string;
}
