"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageUp, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageUploadField({ value, onChange }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/admin/blogs/upload-image", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }
      
      const result = await response.json();
      onChange(result.url);
      setPreview(result.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    setPreview("");
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
      <div className="flex items-center gap-4 flex-wrap">
        <label className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100">
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
          <div className="flex items-center gap-2">
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageUp className="h-4 w-4" />}
            {isUploading ? "Uploading..." : "Choose Image"}
          </div>
        </label>
        {preview && (
          <div className="relative">
            <Image src={preview} alt="Preview" width={64} height={64} className="h-16 w-16 rounded-lg object-cover border" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}