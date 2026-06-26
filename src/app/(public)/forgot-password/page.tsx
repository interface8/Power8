"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sun, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Enter a valid email";
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailErr = validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // API call will go here
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      toast.success("Reset link sent to your email");
    } catch {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Success State
  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/power-7.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <Card className="relative z-10 w-full max-w-md p-6 md:p-8 rounded-2xl shadow-xl bg-white/95">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="p-2 bg-linear-to-br from-orange-500 to-amber-500 rounded-xl shadow">
              <Sun className="w-8 h-8 text-white" />
            </div>
            <span className="text-xl font-semibold text-orange-600">Power-8</span>
          </div>

          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-center mb-2">Check Your Email</h1>
          <p className="text-gray-600 text-center mb-4 text-sm">
            We&apos;ve sent a password reset link to <strong className="text-orange-600">{email}</strong>
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 text-center">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
          </div>

          <p className="text-sm text-gray-500 text-center mb-6">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <button
              onClick={() => {
                setSubmitted(false);
                setEmail("");
              }}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              try again
            </button>
          </p>

          <Button
            variant="outline"
            className="w-full h-12 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
            onClick={() => window.location.href = "/login"}
          >
            Back to Login
          </Button>
        </Card>
      </div>
    );
  }

  // Form State
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/power-7.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <Card className="relative z-10 w-full max-w-md p-6 md:p-8 rounded-2xl shadow-xl bg-white/95">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="p-2 bg-linear-to-br from-orange-500 to-amber-500 rounded-xl shadow">
            <Sun className="w-8 h-8 text-white" />
          </div>
          <span className="text-xl font-semibold text-orange-600">Power-8</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-2">
          Forgot Password
        </h1>
        <p className="text-gray-600 text-center mb-6 text-sm md:text-base">
          Enter your email and we&apos;ll send you a reset link
        </p>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="email">
                Email <span className="text-red-500 text-sm">*</span>
              </Label>
            </div>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={handleEmailChange}
                className="pl-10 h-12 bg-gray-50 border-0 focus:outline-none focus:ring-0 focus:border-transparent"
              />
            </div>
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!email || !!emailError || loading}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}