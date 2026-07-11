"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export function useAuthActions() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // ================= LOGIN =================
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Login failed");
        toast.error(data.message ?? "Login failed");
        return { success: false };
      }

      //  CRITICAL: update global auth state immediately
      setUser(data.user);

      toast.success(data.message ?? "Login successful");

      // Redirect based on user type
      const destination = data.user?.userType === "MERCHANT"
        ? "/merchant/dashboard"
        : "/";

      // small delay ensures state propagates before navigation
      setTimeout(() => {
        router.push(destination);
        router.refresh(); //  forces navbar re-render sync
      }, 50);

      return { success: true };
    } catch {
      setError("Something went wrong");
      toast.error("Something went wrong");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER =================
  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Registration failed");
        toast.error(data.message ?? "Registration failed");
        return { success: false };
      }

      //  set auth immediately after register
      setUser(data.user);

      toast.success(data.message ?? "Registration successful");

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 50);

      return { success: true };
    } catch {
      setError("Something went wrong");
      toast.error("Something went wrong");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
  setLoading(true);

  try {
    // Immediately update UI
    setUser(null);

    // Call backend to clear session
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    
    router.replace("/");


    router.refresh();

    toast.success("Logged out");
  } catch {
    toast.error("Logout failed");
  } finally {
    setLoading(false);
  }
};

  return {
    login,
    register,
    logout,
    loading,
    error,
  };
}
