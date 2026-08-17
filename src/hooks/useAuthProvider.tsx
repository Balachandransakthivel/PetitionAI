import { useState, useEffect, ReactNode } from "react";
import { AuthContext, RegisterData, getStoredUser, storeUser, clearUser, mockLogin } from "@/lib/auth";
import { User } from "@/types";
import { MOCK_USERS } from "@/constants/mockData";
import { apiLogin, apiRegister, isBackendUp } from "@/lib/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      if (await isBackendUp()) {
        const found = await apiLogin(email, password);
        storeUser(found);
        setUser(found);
        setIsLoading(false);
        return { success: true };
      }
    } catch {
      // fall through to mock
    }

    await new Promise(r => setTimeout(r, 800));
    const found = mockLogin(email, password);
    if (!found) {
      setIsLoading(false);
      return { success: false, error: "Invalid email or password." };
    }
    storeUser(found);
    setUser(found);
    setIsLoading(false);
    return { success: true };
  }

  async function register(data: RegisterData) {
    setIsLoading(true);
    try {
      if (await isBackendUp()) {
        const newUser = await apiRegister(data);
        storeUser(newUser);
        setUser(newUser);
        setIsLoading(false);
        return { success: true };
      }
    } catch {
      // fall through to mock
    }

    await new Promise(r => setTimeout(r, 1000));
    const exists = MOCK_USERS.find(u => u.email === data.email);
    if (exists) {
      setIsLoading(false);
      return { success: false, error: "An account with this email already exists." };
    }
    const newUser: User = {
      id: `u_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: "citizen",
      phone: data.phone,
      address: data.address,
      joinedAt: new Date().toISOString(),
    };
    storeUser(newUser);
    setUser(newUser);
    setIsLoading(false);
    return { success: true };
  }

  function logout() {
    clearUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}