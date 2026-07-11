"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Loader2,
  Camera,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";

type MerchantStatus = "PENDING" | "APPROVED" | "SUSPENDED";

interface MerchantProfile {
  id: string;
  businessName: string;
  businessAddress: string;
  cacNumber: string;
  cacDocumentUrl: string;
  governmentIdUrl: string;
  logoUrl: string | null;
  status: MerchantStatus;
  suspensionReason: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

function StatusBadge({ status }: { status: MerchantStatus }) {
  const map: Record<MerchantStatus, { color: string; icon: React.ReactNode; label: string }> = {
    PENDING: { color: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-3.5 h-3.5" />, label: "Pending Review" },
    APPROVED: { color: "bg-green-100 text-green-700", icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: "Approved" },
    SUSPENDED: { color: "bg-red-100 text-red-700", icon: <XCircle className="w-3.5 h-3.5" />, label: "Suspended" },
  };
  const { color, icon, label } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      {icon}{label}
    </span>
  );
}

function DocLink({ label, url }: { label: string; url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 group">
      <FileText className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
      {label}
      <ExternalLink className="w-3.5 h-3.5 ml-auto text-gray-400 group-hover:text-orange-500" />
    </a>
  );
}

export default function MerchantProfilePage() {
  const [profile, setProfile] = useState<MerchantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // edit form state
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/merchant/profile");
        if (!res.ok) return;
        const json = await res.json();
        const d: MerchantProfile = json.data;
        setProfile(d);
        setBusinessName(d.businessName);
        setBusinessAddress(d.businessAddress);
        setLogoUrl(d.logoUrl);
      } catch { toast.error("Failed to load profile"); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "merchant-logos");
    setLogoUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Upload failed"); return; }
      setLogoUrl(data.url);
      toast.success("Logo uploaded");
    } catch { toast.error("Upload failed"); }
    finally { setLogoUploading(false); if (logoInputRef.current) logoInputRef.current.value = ""; }
  };

  const handleSave = async () => {
    if (!businessName.trim()) { toast.error("Business name is required"); return; }
    if (!businessAddress.trim()) { toast.error("Business address is required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/merchant/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: businessName.trim(),
          businessAddress: businessAddress.trim(),
          logoUrl: logoUrl ?? null,
        }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.message || "Failed to save"); return; }
      setProfile((prev) => prev ? { ...prev, businessName: businessName.trim(), businessAddress: businessAddress.trim(), logoUrl } : prev);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch { toast.error("Failed to save profile"); }
    finally { setSaving(false); }
  };

  const cancelEdit = () => {
    if (profile) {
      setBusinessName(profile.businessName);
      setBusinessAddress(profile.businessAddress);
      setLogoUrl(profile.logoUrl);
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-3xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-64 bg-gray-200 rounded-xl" />
        <div className="h-40 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account & Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your merchant profile and view KYC documents</p>
      </div>

      {/* Account status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Account Status</p>
            <StatusBadge status={profile.status} />
          </div>
          <p className="text-xs text-gray-400">
            Member since {new Date(profile.createdAt).toLocaleDateString("en-NG", { month: "long", year: "numeric" })}
          </p>
        </div>

        {profile.status === "SUSPENDED" && profile.suspensionReason && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-700 mb-0.5">Suspension reason</p>
              <p className="text-sm text-red-600">{profile.suspensionReason}</p>
            </div>
          </div>
        )}

        {profile.status === "PENDING" && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2">
            <Clock className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">Your application is under review. You&apos;ll be notified once it&apos;s approved.</p>
          </div>
        )}
      </div>

      {/* Personal info (read-only) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Personal Information</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600"><User className="w-4 h-4 text-gray-400" /><span>{profile.user.name}</span></div>
          <div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4 text-gray-400" /><span>{profile.user.email}</span></div>
          <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4 text-gray-400" /><span>{profile.user.phone}</span></div>
        </div>
        <p className="text-xs text-gray-400 mt-3">To update personal details, contact support.</p>
      </div>

      {/* Business info (editable) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Business Information</p>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2 h-8">
              <Pencil className="w-3.5 h-3.5" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={cancelEdit} className="gap-1.5 h-8">
                <X className="w-3.5 h-3.5" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 h-8 bg-orange-500 hover:bg-orange-600 text-white">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
              </Button>
            </div>
          )}
        </div>

        {/* Logo */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
            {logoUploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : logoUrl ? (
              <Image src={logoUrl} alt="Logo" fill className="object-cover" />
            ) : (
              <Building2 className="w-7 h-7 text-gray-300" />
            )}
            {isEditing && (
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={logoUploading}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
          <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          <div>
            <p className="font-semibold text-gray-900">{profile.businessName}</p>
            <p className="text-xs text-gray-400">CAC: {profile.cacNumber}</p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label>Business Name <span className="text-red-500">*</span></Label>
              <div className="relative mt-1">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="pl-10 h-11" />
              </div>
            </div>
            <div>
              <Label>Business Address <span className="text-red-500">*</span></Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} rows={2} className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-input resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2 text-gray-600">
              <Building2 className="w-4 h-4 text-gray-400 mt-0.5" /><span>{profile.businessName}</span>
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" /><span>{profile.businessAddress}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FileText className="w-4 h-4 text-gray-400" /><span className="font-mono">{profile.cacNumber}</span>
            </div>
          </div>
        )}
      </div>

      {/* KYC Documents (view-only) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">KYC Documents</p>
        <div className="space-y-3">
          <DocLink label="CAC Certificate / Business Registration" url={profile.cacDocumentUrl} />
          <DocLink label="Government-Issued ID" url={profile.governmentIdUrl} />
          {profile.logoUrl && <DocLink label="Business Logo" url={profile.logoUrl} />}
        </div>
        <p className="text-xs text-gray-400 mt-3">Documents are submitted at registration and cannot be changed. Contact support to update KYC documents.</p>
      </div>
    </div>
  );
}
