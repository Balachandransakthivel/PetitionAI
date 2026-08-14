import { createContext, useContext } from "react";
import { User, UserRole } from "@/types";
import { MOCK_USERS } from "@/constants/mockData";

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  isLoading: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem("petition_ai_user");
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Error reading user from localStorage:", err);
    return null;
  }
}

export function storeUser(user: User) {
  localStorage.setItem("petition_ai_user", JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem("petition_ai_user");
}

// Demo credentials
export const DEMO_CREDENTIALS: { email: string; password: string; role: UserRole; label: string }[] = [
  { email: "citizen@demo.com", password: "citizen123", role: "citizen", label: "Citizen" },
  { email: "officer@demo.com", password: "officer123", role: "officer", label: "Officer" },
  { email: "admin@demo.com", password: "admin123", role: "admin", label: "Admin" },
];

export function mockLogin(email: string, password: string): User | null {
  const validPasswords: Record<string, string> = {
    "citizen@demo.com": "citizen123",
    "officer@demo.com": "officer123",
    "admin@demo.com": "admin123",
  };
  if (validPasswords[email] !== password) return null;
  return MOCK_USERS.find(u => u.email === email) || null;
}
