"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sun, Mail, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Enter a valid email (e.g., name@example.com)";
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
      className="min-h-screen w-full  h-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/power-7.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      <Card className="relative z-10 w-full mx-4 my-8 p-6 md:p-8 md:font-semibold gap-0 flex flex-col bg-white rounded-3xl md:w-[30%] md:my-12">
        {/* Back to Home */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-4 pt-4 pb-8">
          <ArrowLeft className="w-7 h-7 mr-4 md:w-6 md:h-6 md:mr-3"/>
          <span className="text-lg">Back to Home</span>
        </Link>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8 md:mb-10">
          <div className="p-2 bg-linear-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
            <Sun className="w-14 h-14 md:w-12 md:h-12 text-white" />
          </div>
          <span className="text-4xl md:text-4xl font-semibold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Power - 8
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-3xl font-semibold text-center mb-6">
          Welcome Back
        </h1>
        <p className="text-[18px] md:text-xl md:font-normal text-black text-center mb-8 md:mb-10">
          Login to your account
        </p>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="">
            <Label htmlFor="email" className="text-xl">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={handleEmailChange}
                required
                className="pl-12 py-7 text-2xl font-light md:py-5 md:text-lg md:font-normal bg-blue-50"
              />
            </div>
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div className="">
            <Label htmlFor="password" className="text-xl">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                required
                className="pl-12 py-7 mb-4 md:py-5 bg-blue-50"
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xl py-8 rounded-xl mb-8 md:py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>

        {/* Register link */}
        <div className="mt-4 text-center text-[17px] font-light text-black pb-6 md:text-[15px] md:font-normal">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-orange-500 hover:text-orange-600 font-medium text-[19px] md:text-[16px]"
          >
            Register here
          </Link>
        </div>
      </Card>
    </div>
  );
}