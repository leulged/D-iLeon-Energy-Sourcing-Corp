"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

import { User } from "@/types/types/user.type";
import { LoginResponseDto } from "@/types/dto/auth/login-response.dto";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string>;
  logout: () => void;
  loading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "token";

// Auth provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Load user from token on startup
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      fetchCurrentUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/profile`);
      setUser(res.data.user as User); // Use res.data.user
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await axios.post("/api/login", { email, password });
    const data: LoginResponseDto = res.data;

    if (!data) return "Invalid email or password";

    setToken(data.token);
    setUser(data.user);

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return data.message;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("role");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy use
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
