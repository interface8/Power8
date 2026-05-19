"use client";

import { createContext, useContext, useEffect, useState } from "react";

/* ================= TYPES ================= */

type User = {
  name: string;
  email: string;
  permissions: string[];
  roles: string[];
};

type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  hasPermission: (permission: string) => boolean;

  register: (data: RegisterInput) => Promise<void>;
  loading: boolean;
  error: string | null;
};

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | null>(null);

/* ================= PROVIDER ================= */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ===== PERMISSION CHECK ===== */
  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.permissions?.includes(permission);
  };

  /* ===== FETCH CURRENT USER ===== */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        setUser(res.ok ? data.user : null);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  /* ===== REGISTER ===== */
  const register = async (data: RegisterInput) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Registration failed");
      }

      setUser(result.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        hasPermission,
        register,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOKS ================= */

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const usePermission = (permission: string) => {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
};
