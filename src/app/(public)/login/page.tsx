"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sun, Mail, Lock, Eye, EyeOff, Check, X, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthActions } from "@/hooks/use-auth-actions";

export default function LoginPage() {
  const { login, loading, error } = useAuthActions();
  const searchParams = useSearchParams();
  const merchantPending = searchParams.get("merchant") === "pending";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Password validation rules
  const passwordRules = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  // Check if all password rules are met
  const allPasswordRulesMet = 
    passwordRules.minLength &&
    passwordRules.hasUpperCase &&
    passwordRules.hasLowerCase &&
    passwordRules.hasNumber &&
    passwordRules.hasSpecialChar;

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
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const emailErr = validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
      return;
    }
    
    if (!allPasswordRulesMet) {
      return;
    }
    
    await login({ email, password });
  }

  const isFormValid = !emailError && email && password && allPasswordRulesMet;

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
          Welcome Back
        </h1>
        <p className="text-gray-600 text-center mb-6 text-sm md:text-base">
          Login to your account
        </p>

        {merchantPending && (
          <div className="mb-4 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Application submitted!</p>
              <p className="text-xs text-amber-700 mt-0.5">Your merchant application is under review. You'll be able to log in once an admin approves your account.</p>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
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

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="password">
                Password <span className="text-red-500 text-sm">*</span>
              </Label>
            </div>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setPasswordFocused(true)}
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

            {/* Password Requirements Checklist */}
            {(passwordFocused || password) && (
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

            {/* Success message when all rules are met */}
            {allPasswordRulesMet && password && (
              <div className="mt-2 flex items-center gap-2">
                <Check className="w-3 h-3 text-green-500" />
                <p className="text-xs text-green-600">Password meets all requirements</p>
              </div>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg"
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}