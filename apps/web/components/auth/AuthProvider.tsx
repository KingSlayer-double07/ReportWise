"use client";

import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@reportwise/shared";

interface User {
  id: string;
  email?: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // const [user, setUser] = useState<User | null>(null);
  // const [token, setToken] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("rw_user") : null;
    return storedUser
      ? JSON.parse(storedUser)
      : {
          id: "1",
          name: "Preview User",
          role: Role.ADMIN, // Change this to Role.TEACHER to see the teacher view
        };
  });
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("rw_token") : null;
    return storedToken || "mock_token";
  });
  const [isLoading, setIsLoading] = useState(false); // Set to false so it doesn't show the spinner

  const router = useRouter();

  const login = (newToken: string, newUser: User) => {
    setIsLoading(true);
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("rw_token", newToken);
    localStorage.setItem("rw_user", JSON.stringify(newUser));

    // Redirect based on role
    if (newUser.role === Role.ADMIN || newUser.role === Role.SUPER_ADMIN) {
      router.push("/dashboard/admin");
    } else if (newUser.role === Role.TEACHER) {
      router.push("/dashboard/teacher");
    } else {
      router.push("/dashboard/student");
    }
    setIsLoading(false);
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
