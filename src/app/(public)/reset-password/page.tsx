"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Sun, Lock, Eye, EyeOff, Check, X, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
    }
  }, [token]);

  const passwordRules = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const allPasswordRulesMet = 
    passwordRules.minLength &&
    passwordRules.hasUpperCase &&
    passwordRules.hasLowerCase &&
    passwordRules.hasNumber &&
    passwordRules.hasSpecialChar;

  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    if (!allPasswordRulesMet) {
      setError("Password does not meet all requirements");
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      toast.success("Password reset successfully!");
    } catch {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken) {
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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center mb-2">Invalid Reset Link</h1>
          <p className="text-gray-600 text-center mb-6 text-sm">
            This password reset link is invalid or has expired.
          </p>
          <Button
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg"
            onClick={() => router.push("/forgot-password")}
          >
            Request New Reset Link
          </Button>
        </Card>
      </div>
    );
  }

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
          <h1 className="text-2xl font-semibold text-center mb-2">Password Reset Successful</h1>
          <p className="text-gray-600 text-center mb-6 text-sm">
            Your password has been reset successfully.
          </p>
          <Button
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg"
            onClick={() => router.push("/login")}
          >
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

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
          Create New Password
        </h1>
        <p className="text-gray-600 text-center mb-6 text-sm md:text-base">
          Enter your new password below
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
              <Label htmlFor="password">
                New Password <span className="text-red-500 text-sm">*</span>
              </Label>
            </div>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-12 bg-gray-50 border-0 focus:outline-none focus:ring-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            {password && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium text-gray-500 mb-1">Password must have:</p>
                <div className="flex items-center gap-2 text-xs">
                  {passwordRules.minLength ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <X className="w-3 h-3 text-gray-300" />
                  )}
                  <span className={passwordRules.minLength ? "text-green-600" : "text-gray-500"}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {passwordRules.hasUpperCase ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <X className="w-3 h-3 text-gray-300" />
                  )}
                  <span className={passwordRules.hasUpperCase ? "text-green-600" : "text-gray-500"}>
                    One uppercase letter (A-Z)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {passwordRules.hasNumber ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <X className="w-3 h-3 text-gray-300" />
                  )}
                  <span className={passwordRules.hasNumber ? "text-green-600" : "text-gray-500"}>
                    One number (0-9)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {passwordRules.hasSpecialChar ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <X className="w-3 h-3 text-gray-300" />
                  )}
                  <span className={passwordRules.hasSpecialChar ? "text-green-600" : "text-gray-500"}>
                    One special character (!@#$%^&*)
                  </span>
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="confirm-password">
                Confirm Password <span className="text-red-500 text-sm">*</span>
              </Label>
            </div>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 h-12 bg-gray-50 border-0 focus:outline-none focus:ring-0"
              />
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
            {confirmPassword && passwordsMatch && (
              <div className="mt-1 flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                <p className="text-xs text-green-600">Passwords match</p>
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={!allPasswordRulesMet || !passwordsMatch || loading}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg"
          >
            {loading ? "Resetting..." : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}