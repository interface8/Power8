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


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login({ email, password });
  }

  return (
   <div className="min-h-screen w-full flex items-center justify-center rounded-xl">
  <Card className="w-full min-h-[90vh] mx-4 my-8 p-6 md:p-8 md:font-semibold gap-0 flex flex-col bg-white rounded-2xl md:w-[30%] md:min-h-auto md:my-12">
    {/* Back to Home */}
    <Link href="/" className="flex items-center justify-center gap-2 mb-6 pt-7 pb-17">
      <ArrowLeft className="w-7 h-7 mr-4 md:w-6 md:h-6 md:mr-3"/>
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
      Welcome Back
    </h1>
    <p className="text-[18px] md:text-xl md:font-normal text-gray-600 text-center mb-18 md:mb-18">
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
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className=" pl-12 py-7 text-2xl font-light md:py-5 md:text-lg md:font-normal bg-blue-50"
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
            className="pl-12 py-7 mb-6 md:py-5 bg-blue-50"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xl py-8 rounded-xl mb-14 md:py-6"
      >
        {loading ? "Signing in..." : "Login"}
      </Button>
    </form>

    {/* Register link */}
    <div className="mt-6 text-center text-[17px] font-light text-gray-600 pb-10 md:text-[15px] md:font-normal">
      Don&apos;t have an account?{" "}
      <Link
        href="/register"
        className="text-orange-500 hover:text-orange-600 font-medium text-[19px] md:text-[16px]"
      >
        Register here
      </Link>
    </div>

    {/* Demo credentials */}
    <div className="mt-6 mb-6 md:mt-8 p-3 md:p-4 bg-blue-50 rounded-xl py-8">
      <p className="text-xl font-medium text-blue-800 mb-2 md:text-base">
        Demo Credentials:
      </p>
      <p className="text-xl font-medium text-blue-700 md:font-normal md:text-base">
        Admin: admin@power8.com / admin123
      </p>
      <p className="text-xl font-medium text-blue-700 md:font-normal md:text-base">
        Customer: any email / any password
      </p>
    </div>
  </Card>
</div>
  );
}
