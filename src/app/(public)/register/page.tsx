"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sun,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Building2,
  MapPin,
  FileText,
  Upload,
  Loader2,
  Store,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { toast } from "sonner";

type AccountType = "customer" | "merchant" | null;

interface UploadedFile {
  url: string;
  name: string;
}

function PasswordRules({ password, focused }: { password: string; focused: boolean }) {
  const rules = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  if (!focused) return null;
  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs font-medium text-gray-500 mb-1">Password must have:</p>
      {(
        [
          [rules.minLength, "At least 8 characters"],
          [rules.hasUpperCase, "One uppercase letter (A-Z)"],
          [rules.hasLowerCase, "One lowercase letter (a-z)"],
          [rules.hasNumber, "One number (0-9)"],
          [rules.hasSpecialChar, "One special character"],
        ] as [boolean, string][]
      ).map(([met, label]) => (
        <div key={label} className="flex items-center gap-2 text-xs">
          {met ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-gray-300" />}
          <span className={met ? "text-green-600" : "text-gray-500"}>{label}</span>
        </div>
      ))}
    </div>
  );
}

function DocumentUpload({
  label, required, accept, hint, value, onChange, uploading,
}: {
  label: string; required?: boolean; accept: string; hint: string;
  value: UploadedFile | null; onChange: (f: UploadedFile | null) => void; uploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("purpose", "kyc");
    onChange({ url: "__uploading__", name: file.name });
    try {
      const res = await fetch("/api/upload/registration", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Upload failed"); onChange(null); return; }
      onChange({ url: data.url, name: file.name });
    } catch { toast.error("Upload failed"); onChange(null); }
    finally { if (inputRef.current) inputRef.current.value = ""; }
  };

  const isUploading = value?.url === "__uploading__";
  const isDone = value && value.url !== "__uploading__";

  return (
    <div>
      <Label>{label} {required && <span className="text-red-500 text-sm">*</span>}</Label>
      <p className="text-xs text-gray-400 mb-1 mt-0.5">{hint}</p>
      <div
        className={`relative mt-1 flex items-center gap-3 rounded-lg border-2 border-dashed px-4 py-3 cursor-pointer transition-colors ${isDone ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50"}`}
        onClick={() => !isUploading && inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} disabled={uploading || isUploading} />
        {isUploading ? <Loader2 className="w-5 h-5 text-orange-500 animate-spin shrink-0" />
          : isDone ? <Check className="w-5 h-5 text-green-500 shrink-0" />
          : <Upload className="w-5 h-5 text-gray-400 shrink-0" />}
        <span className="text-sm truncate">{isUploading ? "Uploading..." : isDone ? value!.name : "Click to upload"}</span>
        {isDone && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onChange(null); }} className="ml-auto text-gray-400 hover:text-red-500">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function AccountTypeSelector({ onSelect }: { onSelect: (t: AccountType) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-center text-gray-800">How do you want to use Power‑8?</h2>
      <p className="text-sm text-center text-gray-500 mb-6">Choose your account type to get started</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button type="button" onClick={() => onSelect("customer")} className="group flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all text-left">
          <div className="p-3 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors"><UserCheck className="w-7 h-7 text-orange-600" /></div>
          <div><p className="font-semibold text-gray-900">Customer</p><p className="text-xs text-gray-500 mt-1">Browse and buy solar products for your home or business</p></div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 self-end" />
        </button>
        <button type="button" onClick={() => onSelect("merchant")} className="group flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all text-left">
          <div className="p-3 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors"><Store className="w-7 h-7 text-green-600" /></div>
          <div><p className="font-semibold text-gray-900">Merchant</p><p className="text-xs text-gray-500 mt-1">List and sell your solar products on the Power‑8 platform</p></div>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 self-end" />
        </button>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading: customerLoading, error: customerError } = useAuthActions();
  const [accountType, setAccountType] = useState<AccountType>(null);

  // shared fields
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // merchant-specific
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [cacNumber, setCacNumber] = useState("");
  const [cacDocument, setCacDocument] = useState<UploadedFile | null>(null);
  const [governmentId, setGovernmentId] = useState<UploadedFile | null>(null);
  const [businessLogo, setBusinessLogo] = useState<UploadedFile | null>(null);
  const [merchantLoading, setMerchantLoading] = useState(false);
  const [merchantError, setMerchantError] = useState("");

  const passwordRules = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const allPasswordRulesMet = Object.values(passwordRules).every(Boolean);

  const validateName = (v: string) => { if (!v) return "Full name is required"; if (v.length < 2) return "Name must be at least 2 characters"; return ""; };
  const validateEmail = (v: string) => { if (!v) return "Email is required"; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email"; return ""; };
  const validatePhone = (v: string) => { if (!v) return "Phone number is required"; if (!/^[\+]?[0-9]{8,15}$/.test(v)) return "Enter a valid phone number"; return ""; };

  async function handleCustomerSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nameErr = validateName(name); if (nameErr) { setNameError(nameErr); return; }
    const emailErr = validateEmail(email); if (emailErr) { setEmailError(emailErr); return; }
    const phoneErr = validatePhone(phone); if (phoneErr) { setPhoneError(phoneErr); return; }
    if (!allPasswordRulesMet) { setPasswordError("Password does not meet requirements"); return; }
    if (password !== confirmPassword) { setConfirmError("Passwords do not match"); return; }
    const success = await register({ name, email, phone, password });
    if (success) router.push("/login");
  }

  async function handleMerchantSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMerchantError("");
    const nameErr = validateName(name); if (nameErr) { setNameError(nameErr); return; }
    const emailErr = validateEmail(email); if (emailErr) { setEmailError(emailErr); return; }
    const phoneErr = validatePhone(phone); if (phoneErr) { setPhoneError(phoneErr); return; }
    if (!allPasswordRulesMet) { setPasswordError("Password does not meet requirements"); return; }
    if (password !== confirmPassword) { setConfirmError("Passwords do not match"); return; }
    if (!businessName.trim()) { setMerchantError("Business name is required"); return; }
    if (!businessAddress.trim()) { setMerchantError("Business address is required"); return; }
    if (!cacNumber.trim()) { setMerchantError("CAC registration number is required"); return; }
    if (!cacDocument || cacDocument.url === "__uploading__") { setMerchantError("CAC document upload is required"); return; }
    if (!governmentId || governmentId.url === "__uploading__") { setMerchantError("Government ID upload is required"); return; }

    setMerchantLoading(true);
    try {
      const res = await fetch("/api/auth/register/merchant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), email: email.trim(), phone: phone.trim(), password,
          businessName: businessName.trim(), businessAddress: businessAddress.trim(),
          cacNumber: cacNumber.trim(), cacDocumentUrl: cacDocument.url,
          governmentIdUrl: governmentId.url,
          ...(businessLogo && businessLogo.url !== "__uploading__" ? { logoUrl: businessLogo.url } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setMerchantError(data.message || "Registration failed"); return; }
      toast.success("Application submitted! You'll be notified once your account is reviewed.");
      router.push("/login?merchant=pending");
    } catch { setMerchantError("Something went wrong. Please try again."); }
    finally { setMerchantLoading(false); }
  }

  const isUploading = cacDocument?.url === "__uploading__" || governmentId?.url === "__uploading__" || businessLogo?.url === "__uploading__";
  const customerFormValid = name && email && phone && password && confirmPassword && !nameError && !emailError && !phoneError && !passwordError && !confirmError && allPasswordRulesMet && password === confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/power-7.jpg')" }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <Card className="relative z-10 w-full max-w-md lg:max-w-2xl p-6 sm:p-8 rounded-2xl shadow-xl bg-white/95">
        {accountType !== null ? (
          <button type="button" onClick={() => setAccountType(null)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6">
            <ArrowLeft className="w-4 h-4" /> Change account type
          </button>
        ) : (
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        )}

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="p-2 bg-linear-to-br from-orange-500 to-amber-500 rounded-xl shadow-md"><Sun className="w-8 h-8 text-white" /></div>
          <span className="text-2xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Power - 8</span>
        </div>

        {accountType === null && <AccountTypeSelector onSelect={setAccountType} />}

        {accountType === "customer" && (
          <>
            <h1 className="text-2xl font-semibold text-center">Create Customer Account</h1>
            <p className="text-gray-500 text-center mb-6 text-sm">Fill in your details to get started</p>
            {customerError && <Alert variant="destructive" className="mb-4"><AlertDescription>{customerError}</AlertDescription></Alert>}
            <form onSubmit={handleCustomerSubmit} className="space-y-5">
              <div>
                <Label>Full Name <span className="text-red-500 text-sm">*</span></Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input value={name} onChange={(e) => { setName(e.target.value); setNameError(validateName(e.target.value)); }} autoComplete="name" className="pl-10 h-12 bg-gray-50 border-0" placeholder="John Doe" />
                </div>
                {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
              </div>
              <div>
                <Label>Email <span className="text-red-500 text-sm">*</span></Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(validateEmail(e.target.value)); }} autoComplete="email" className="pl-10 h-12 bg-gray-50 border-0" placeholder="you@example.com" />
                </div>
                {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
              </div>
              <div>
                <Label>Phone <span className="text-red-500 text-sm">*</span></Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input value={phone} onChange={(e) => { setPhone(e.target.value); setPhoneError(validatePhone(e.target.value)); }} autoComplete="tel" className="pl-10 h-12 bg-gray-50 border-0" placeholder="+2349012345678" />
                </div>
                {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
              </div>
              <div>
                <Label>Password <span className="text-red-500 text-sm">*</span></Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} autoComplete="new-password" className="pl-10 pr-10 h-12 bg-gray-50 border-0" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">{showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}</button>
                </div>
                <PasswordRules password={password} focused={passwordFocused} />
                {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
              </div>
              <div>
                <Label>Confirm Password <span className="text-red-500 text-sm">*</span></Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(""); }} autoComplete="new-password" className="pl-10 pr-10 h-12 bg-gray-50 border-0" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">{showConfirmPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}</button>
                </div>
                {confirmError && <p className="text-xs text-red-500 mt-1">{confirmError}</p>}
              </div>
              <Button type="submit" disabled={!customerFormValid || customerLoading} className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                {customerLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
              </Button>
              <p className="text-center text-sm text-gray-500">Already have an account? <Link href="/login" className="text-orange-600 font-medium hover:underline">Sign in</Link></p>
            </form>
          </>
        )}

        {accountType === "merchant" && (
          <>
            <h1 className="text-2xl font-semibold text-center">Merchant Application</h1>
            <p className="text-gray-500 text-center mb-6 text-sm">Complete your KYC to list products on Power‑8. Your account will be reviewed before activation.</p>
            {merchantError && <Alert variant="destructive" className="mb-4"><AlertDescription>{merchantError}</AlertDescription></Alert>}
            <form onSubmit={handleMerchantSubmit} className="space-y-5">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Personal Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name <span className="text-red-500 text-sm">*</span></Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input value={name} onChange={(e) => { setName(e.target.value); setNameError(validateName(e.target.value)); }} className="pl-10 h-11 bg-white border-gray-200" placeholder="John Doe" />
                    </div>
                    {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
                  </div>
                  <div>
                    <Label>Phone <span className="text-red-500 text-sm">*</span></Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input value={phone} onChange={(e) => { setPhone(e.target.value); setPhoneError(validatePhone(e.target.value)); }} autoComplete="tel" className="pl-10 h-11 bg-white border-gray-200" placeholder="+2349012345678" />
                    </div>
                    {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
                  </div>
                </div>
                <div>
                  <Label>Email <span className="text-red-500 text-sm">*</span></Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(validateEmail(e.target.value)); }} autoComplete="email" className="pl-10 h-11 bg-white border-gray-200" placeholder="you@example.com" />
                  </div>
                  {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Password <span className="text-red-500 text-sm">*</span></Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} autoComplete="new-password" className="pl-10 pr-10 h-11 bg-white border-gray-200" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">{showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}</button>
                    </div>
                    <PasswordRules password={password} focused={passwordFocused} />
                    {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
                  </div>
                  <div>
                    <Label>Confirm Password <span className="text-red-500 text-sm">*</span></Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(""); }} autoComplete="new-password" className="pl-10 pr-10 h-11 bg-white border-gray-200" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">{showConfirmPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}</button>
                    </div>
                    {confirmError && <p className="text-xs text-red-500 mt-1">{confirmError}</p>}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Business Information</p>
                <div>
                  <Label>Business Name <span className="text-red-500 text-sm">*</span></Label>
                  <div className="relative mt-1">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="pl-10 h-11 bg-white border-gray-200" placeholder="Acme Solar Ltd" />
                  </div>
                </div>
                <div>
                  <Label>Business Address <span className="text-red-500 text-sm">*</span></Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} rows={2} className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg bg-white border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-orange-300" placeholder="12 Solar Street, Lagos, Nigeria" />
                  </div>
                </div>
                <div>
                  <Label>CAC Registration Number <span className="text-red-500 text-sm">*</span></Label>
                  <div className="relative mt-1">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input value={cacNumber} onChange={(e) => setCacNumber(e.target.value)} className="pl-10 h-11 bg-white border-gray-200" placeholder="RC 1234567" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">KYC Documents</p>
                <DocumentUpload label="CAC Certificate / Business Registration Document" required accept="image/*,application/pdf" hint="Upload your CAC certificate or business registration. PDF or image, max 5MB." value={cacDocument} onChange={setCacDocument} uploading={isUploading} />
                <DocumentUpload label="Government-Issued ID" required accept="image/*,application/pdf" hint="National ID, International Passport, or Driver's Licence. PDF or image, max 5MB." value={governmentId} onChange={setGovernmentId} uploading={isUploading} />
                <DocumentUpload label="Business Logo (Optional)" accept="image/*" hint="Your company logo. JPG, PNG, or WEBP, max 5MB." value={businessLogo} onChange={setBusinessLogo} uploading={isUploading} />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <p className="font-medium mb-1">What happens next?</p>
                <p className="text-xs leading-relaxed">After submitting, your application enters a review queue. Our team will verify your documents and approve your account — usually within 1–2 business days. You will not be able to log in until approved.</p>
              </div>

              <Button type="submit" disabled={merchantLoading || isUploading} className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold">
                {merchantLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
              </Button>
              <p className="text-center text-sm text-gray-500">Already have an account? <Link href="/login" className="text-orange-600 font-medium hover:underline">Sign in</Link></p>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}

