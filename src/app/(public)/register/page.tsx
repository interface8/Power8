"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sun, User, Mail, Phone, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const { register, loading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }
    setConfirmError("");
    await register({ name, email, phone, password });
  }

  return (
  <div className="min-h-screen w-full flex items-center justify-center rounded-xl">
  <Card className="w-full min-h-[90vh] mx-4 my-8 p-6 md:p-8 md:font-semibold gap-0 flex flex-col bg-white rounded-3xl md:w-[30%] md:min-h-auto md:my-12">
    {/* Back to Home */}
    <Link href="/" className="flex items-center justify-center gap-2 mb-6 pt-7 pb-17">
      <ArrowLeft className="w-7 h-7 mr-4 md:w-6 md:h-6 md:mr-3" />
      <span className="text-xl">Back to Home</span>
    </Link>

    {/* Logo */}
    <div className="flex items-center justify-center gap-2 mb-20 md:mb-18">
      <div className="p-2 bg-linear-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
        <Sun className="w-14 h-14 md:w-12 md:h-12 text-white" />
      </div>
      <span className="text-4xl md:text-3xl font-semibold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
        Power - 8
      </span>
    </div>

    {/* Heading */}
    <h1 className="text-4xl md:text-3xl font-semibold text-center mb-15">
      Create Account
    </h1>
    <p className="text-[18px] md:text-xl md:font-normal text-gray-600 text-center mb-18 md:mb-18">
      Enter your information to get started
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
        <Label htmlFor="name" className="text-xl">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="pl-12 py-7 text-2xl font-light md:py-5 md:text-lg md:font-normal  bg-blue-50"
          />
        </div>
      </div>

      <div className="">
        <Label htmlFor="email" className="text-xl">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-12 py-7 text-2xl font-light md:py-5 md:text-lg md:font-normal bg-blue-50"
          />
        </div>
      </div>

      <div className="">
        <Label htmlFor="phone" className="text-xl">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            placeholder="+234 800 000 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="pl-12 py-7 text-2xl font-light md:py-5 md:text-lg md:font-normal bg-blue-50"
          />
        </div>
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
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="pl-12 py-7 text-2xl font-light md:py-5 md:text-lg md:font-normal bg-blue-50"
          />
        </div>
      </div>

      <div className="">
        <Label htmlFor="confirmPassword" className="text-xl">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="pl-12 py-7 text-2xl font-light md:py-5 md:text-lg md:font-normal bg-blue-50"
          />
        </div>
        {confirmError && (
          <p className="text-sm text-red-500 mt-1">{confirmError}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xl py-8 rounded-xl mb-14 md:py-6"
      >
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>

    {/* Login link */}
    <div className="mt-6 text-center text-[17px] font-light text-gray-600 pb-10 md:text-[15px] md:font-normal">
      Already have an account?{" "}
      <Link
        href="/login"
        className="text-orange-500 hover:text-orange-600 font-medium text-[19px] md:text-[16px] bg-blue-50"
      >
        Sign in here
      </Link>
    </div>
  </Card>
</div>
  );
}
