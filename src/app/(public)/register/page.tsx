"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sun, User, Mail, Phone, Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthActions } from "@/hooks/use-auth-actions";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error } = useAuthActions();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Same password validation rules as Login page (ONLY ONCE)
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

  const validateName = (name: string) => {
    if (!name) return "Full name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Enter a valid email";
    return "";
  };

  const validatePhone = (phone: string) => {
    if (!phone) return "Phone number is required";
    const phoneRegex = /^[\+]?[0-9]{8,15}$/;
    if (!phoneRegex.test(phone)) return "Enter a valid phone number";
    return "";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate name
    const nameErr = validateName(name);
    if (nameErr) {
      setNameError(nameErr);
      return;
    }

    // Validate email
    const emailErr = validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
      return;
    }

    // Validate phone
    const phoneErr = validatePhone(phone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }

    // Validate password meets requirements
    if (!allPasswordRulesMet) {
      setPasswordError("Password does not meet requirements");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }

    const success = await register({ name, email, phone, password });
    
    if (success) {
      router.push("/login");
    }
  }

  const isFormValid =
    name &&
    email &&
    phone &&
    password &&
    confirmPassword &&
    !nameError &&
    !emailError &&
    !phoneError &&
    !passwordError &&
    !confirmError &&
    allPasswordRulesMet &&
    password === confirmPassword;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/power-7.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <Card className="relative z-10 w-full max-w-md lg:max-w-lg p-6 sm:p-8 rounded-2xl shadow-xl bg-white/95">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="p-2 bg-linear-to-br from-orange-500 to-amber-500 rounded-xl shadow-md">
            <Sun className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Power - 8
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-center">Create Account</h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Fill in your details to get started
        </p>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name - Required */}
          <div>
            <div className="flex justify-between items-center">
              <Label>Full Name <span className="text-red-500 text-sm">*</span></Label>
            </div>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError(validateName(e.target.value));
                }}
                autoComplete="name"
                name="fullName"
                className="pl-10 h-12 bg-gray-50 border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
            {nameError && (
              <p className="text-xs text-red-500 mt-1">{nameError}</p>
            )}
          </div>

          {/* Email - Required */}
          <div>
            <div className="flex justify-between items-center">
              <Label>Email <span className="text-red-500 text-sm">*</span></Label>
            </div>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(validateEmail(e.target.value));
                }}
                autoComplete="email"
                name="email"
                className="pl-10 h-12 bg-gray-50 border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            {emailError && (
              <p className="text-xs text-red-500 mt-1">{emailError}</p>
            )}
          </div>

          {/* Phone - Required */}
          <div>
            <div className="flex justify-between items-center">
              <Label>Phone <span className="text-red-500 text-sm">*</span></Label>
            </div>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneError(validatePhone(e.target.value));
                }}
                autoComplete="tel"
                name="phone"
                className="pl-10 h-12 bg-gray-50 border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                placeholder="+2349012345678"
              />
            </div>
            {phoneError && (
              <p className="text-xs text-red-500 mt-1">{phoneError}</p>
            )}
          </div>

          {/* Password - Required */}
          <div>
            <div className="flex justify-between items-center">
              <Label>Password <span className="text-red-500 text-sm">*</span></Label>
            </div>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                autoComplete="new-password"
                name="password"
                className="pl-10 pr-10 h-12 bg-gray-50 border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                placeholder="••••••••"
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
            {passwordFocused && (
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

            {passwordError && (
              <p className="text-xs text-red-500 mt-1">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password - Required */}
          <div>
            <div className="flex justify-between items-center">
              <Label>Confirm Password <span className="text-red-500 text-sm">*</span></Label>
            </div>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmError(
                    e.target.value !== password ? "Passwords do not match" : "",
                  );
                }}
                autoComplete="off"
                name="confirmPassword"
                className="pl-10 pr-10 h-12 bg-gray-50 border-0 focus:outline-none focus:ring-0 focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            {confirmError && (
              <p className="text-xs text-red-500 mt-1">{confirmError}</p>
            )}
            {confirmFocused && confirmPassword && password === confirmPassword && (
              <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" /> Passwords match
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}