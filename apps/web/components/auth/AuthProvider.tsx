"use client";
import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Role, User } from "@reportwise/shared"; // ← User moved to shared
import { getDashboardRoute } from "@/lib/auth"; // ← extracted helper
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

function getInitialUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("rw_user");
  try {
    if (stored) return JSON.parse(stored);
  } catch {
    localStorage.removeItem("rw_user");
  }
  if (process.env.NODE_ENV === "development") {
    return {
      id: "1",
      role: Role.ADMIN,
      email: "test@dev.com",
      mustChangePassword: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  return null;
}

function getInitialToken(): string | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("rw_token");
  if (stored && !isTokenExpired(stored)) return stored;
  if (stored) localStorage.removeItem("rw_token");
  return process.env.NODE_ENV === "development" ? "mock_token" : null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (newToken: string, newUser: User) => {
    setIsLoading(true);
    try {
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem("rw_token", newToken);
      localStorage.setItem("rw_user", JSON.stringify(newUser));
      await router.push(getDashboardRoute(newUser.role));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("rw_token");
    localStorage.removeItem("rw_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
