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
  
  // Error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  // Validation functions
  const validateName = (name: string) => {
    if (!name) return "Full name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Enter a valid email (e.g., name@example.com)";
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone) return "Phone number is required";
    if (phone.length < 10) return "Enter a valid phone number";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  // Real-time handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setNameError(validateName(value));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    setPhoneError(validatePhone(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
    if (confirmPassword) {
      setConfirmError(confirmPassword !== value ? "Passwords do not match" : "");
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmError("Passwords do not match");
    } else {
      setConfirmError("");
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }
    setConfirmError("");
    await register({ name, email, phone, password });
  }

  const isFormValid = !nameError && !emailError && !phoneError && !passwordError && !confirmError && name && email && phone && password && confirmPassword;

  return (
    <div className="min-h-screen w-full flex items-center justify-center rounded-xl">
      <Card className="w-full mx-4 my-8 p-6 md:p-8 md:font-semibold gap-0 flex flex-col bg-white rounded-3xl md:w-[30%] md:my-12">
        {/* Back to Home */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-4 pt-4 pb-8">
          <ArrowLeft className="w-7 h-7 mr-4 md:w-6 md:h-6 md:mr-3" />
          <span className="text-xl">Back to Home</span>
        </Link>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8 md:mb-10">
          <div className="p-2 bg-linear-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg">
            <Sun className="w-14 h-14 md:w-12 md:h-12 text-white" />
          </div>
          <span className="text-4xl md:text-3xl font-semibold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Power - 8
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-3xl font-semibold text-center mb-6">
          Create Account
        </h1>
        <p className="text-[18px] md:text-xl md:font-normal text-gray-600 text-center mb-8 md:mb-10">
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
          {/* Full Name */}
          <div className="">
            <Label htmlFor="name" className="text-xl">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={handleNameChange}
                required
                className="pl-12 py-7 text-2xl font-light md:py-5 md:text-lg md:font-normal bg-blue-50 rounded-xl"
              />
            </div>
            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
          </div>

          {/* Email */}
          <div className="">
            <Label htmlFor="email" className="text-xl">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={handleEmailChange}
                required
                className="pl-12 py-7 text-2xl font-light md:py-5 md:text-lg md:font-normal bg-blue-50 rounded-xl"
              />
            </div>
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          {/* Phone */}
          <div className="">
            <Label htmlFor="phone" className="text-xl">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="+234 800 000 000"
                value={phone}
                onChange={handlePhoneChange}
                required
                className="pl-12 py-7 text-2xl font-light md:py-5 md:text-lg md:font-normal bg-blue-50 rounded-xl"
              />
            </div>
            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
          </div>

          {/* Password */}
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
                className="pl-12 py-7 text-2xl font-light md:py-5 md:text-lg md:font-normal bg-blue-50 rounded-xl"
              />
            </div>
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          {/* Confirm Password */}
          <div className="">
            <Label htmlFor="confirmPassword" className="text-xl">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                className="pl-12 py-7 text-2xl font-light md:py-5 md:text-lg md:font-normal bg-blue-50 rounded-xl"
              />
            </div>
            {confirmError && <p className="text-red-500 text-sm mt-1">{confirmError}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xl py-8 rounded-xl mb-6 md:py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        {/* Login link */}
        <div className="mt-2 text-center text-[17px] font-light text-gray-600 pb-4 md:text-[15px] md:font-normal">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-orange-500 hover:text-orange-600 font-medium text-[19px] md:text-[16px]"
          >
            Sign in here
          </Link>
        </div>
      </Card>
    </div>
  );
}