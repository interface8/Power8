"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sun, Mail, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthActions } from "@/hooks/use-auth-actions";

export default function LoginPage() {
  const { login, loading, error } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  
  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return "Enter a valid email (e.g., name@example.com)";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login({ email, password });
  }

  const isFormValid = !emailError && !passwordError && email && password;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/power-7.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <Card className="relative z-10 w-full mx-4 my-8 p-6 md:p-8 flex flex-col bg-white rounded-3xl md:w-[30%]">
        {/* Back */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Home</span>
        </Link>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 bg-linear-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
            <Sun className="w-12 h-12 text-white" />
          </div>
          <span className="text-3xl font-semibold text-orange-600">
            Power - 8
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-center mb-6">Login to your account</p>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <Label>Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="pl-10"
                placeholder="your@email.com"
              />
            </div>
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>

          {/* Password */}
          <div>
            <Label>Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="pl-10"
                placeholder="••••••••"
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>

        {/* Register */}
        <div className="text-center mt-4 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-orange-500">
            Register here
          </Link>
        </div>
      </Card>
    </div>
  );
}
