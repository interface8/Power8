"use client";

import { UserCircle2 } from "lucide-react";

export default function MerchantProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account & Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings</p>
      </div>
      
      <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-gray-200">
        <UserCircle2 className="h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-500">Profile settings coming soon</p>
        <p className="text-sm text-gray-400 mt-1">You&apos;ll be able to manage your account here</p>
      </div>
    </div>
  );
}