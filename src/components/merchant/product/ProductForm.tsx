"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Upload, X, Loader2, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  warranty: number;
  stockQuantity: number;
  capacity: string;
  isActive: boolean;
}

interface ImageItem {
  url: string;
  file?: File;
  isUploading?: boolean;
}

interface ProductSubmitData {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  warranty: number;
  stockQuantity: number;
  capacity: string | null;
  isActive: boolean;
  imageUrls: string[];
}

interface ProductFormProps {
  initialData?: ProductFormData & { id?: string };
  categories: Category[];
  isEdit?: boolean;
  status?: "approved" | "pending" | "rejected";
  rejectionReason?: string | null;
  existingImages?: string[];
  onSubmit: (data: ProductSubmitData) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({
  initialData,
  categories,
  isEdit = false,
  status,
  rejectionReason,
  existingImages = [],
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    categoryId: initialData?.categoryId || "",
    price: initialData?.price || 0,
    warranty: initialData?.warranty || 0,
    stockQuantity: initialData?.stockQuantity || 0,
    capacity: initialData?.capacity || "",
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  });
  const [imageUrls, setImageUrls] = useState<string[]>(existingImages);
  const [imagePreviews, setImagePreviews] = useState<ImageItem[]>(
    existingImages.map(url => ({ url, isUploading: false }))
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formDataObj });
      const data = await res.json();
      if (res.ok) {
        return data.url;
      }
      toast.error("Failed to upload image");
      return null;
    } catch {
      toast.error("Failed to upload image");
      return null;
    }
  };

  const handleImageUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remainingSlots = 4 - imagePreviews.length;
    
    if (remainingSlots <= 0) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    const filesToUpload = fileArray.slice(0, remainingSlots);
    
    const newPreviews: ImageItem[] = filesToUpload.map(file => ({
      url: URL.createObjectURL(file),
      file,
      isUploading: true,
    }));
    
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setUploadingImages(true);

    const uploadedUrls: string[] = [];
    for (const item of newPreviews) {
      const uploadedUrl = await uploadImage(item.file!);
      if (uploadedUrl) {
        uploadedUrls.push(uploadedUrl);
        setImagePreviews(prev =>
          prev.map(p => 
            p.file === item.file ? { ...p, url: uploadedUrl, isUploading: false } : p
          )
        );
      } else {
        setImagePreviews(prev => prev.filter(p => p.file !== item.file));
      }
    }
    
    setImageUrls(prev => [...prev, ...uploadedUrls]);
    setUploadingImages(false);
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleImageUpload(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (formData.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (formData.stockQuantity < 0) {
      toast.error("Stock quantity cannot be negative");
      return;
    }

    setLoading(true);
    try {
      const submitData: ProductSubmitData = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        price: formData.price,
        warranty: formData.warranty,
        stockQuantity: formData.stockQuantity,
        capacity: formData.capacity || null,
        isActive: formData.isActive,
        imageUrls,
      };
      await onSubmit(submitData);
    } catch {
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value: number) => {
    if (value === 0) return "";
    return value.toLocaleString();
  };

  const handleNumberChange = (field: 'price' | 'stockQuantity' | 'warranty', value: string) => {
    if (value === "") {
      setFormData({ ...formData, [field]: 0 });
      return;
    }
    const rawValue = value.replace(/,/g, '');
    const num = field === 'price' ? parseFloat(rawValue) : parseInt(rawValue, 10);
    if (!isNaN(num)) {
      setFormData({ ...formData, [field]: num });
    }
  };

  const statusConfig = {
    approved: { label: "Approved", className: "bg-green-100 text-green-700" },
    pending: { label: "Pending Review", className: "bg-yellow-100 text-yellow-700" },
    rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-full">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 text-base text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to products
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Product details</h1>

        {isEdit && status && (
          <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg border">
            <span className="text-base font-medium text-gray-700">Status:</span>
            <span className={`${statusConfig[status].className} text-base`}>
              {statusConfig[status].label}
            </span>
            {status === "rejected" && rejectionReason && (
              <p className="text-base text-gray-600 ml-4">
                Reason: {rejectionReason}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Form Fields */}
              <div className="flex-1 space-y-5">
                <div>
                  <Label className="text-base font-semibold text-gray-700">
                    Product name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Mono Solar Panel 400W"
                    className="mt-1.5 h-12 text-base"
                    required
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold text-gray-700">Description</Label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your product — specifications, features, what's included..."
                    rows={4}
                    className="w-full px-3 py-2 mt-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base"
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                    <SelectTrigger className="mt-1.5 h-12 text-base">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} className="text-base">{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-base font-semibold text-gray-700">
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      value={formatNumber(formData.price)}
                      onChange={(e) => handleNumberChange('price', e.target.value)}
                      placeholder="85,000"
                      className="mt-1.5 h-12 text-base"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-base font-semibold text-gray-700">Warranty (years)</Label>
                    <Input
                      type="text"
                      value={formatNumber(formData.warranty)}
                      onChange={(e) => handleNumberChange('warranty', e.target.value)}
                      placeholder="5"
                      className="mt-1.5 h-12 text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-base font-semibold text-gray-700">
                      Stock quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      value={formatNumber(formData.stockQuantity)}
                      onChange={(e) => handleNumberChange('stockQuantity', e.target.value)}
                      placeholder="24"
                      className="mt-1.5 h-12 text-base"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-base font-semibold text-gray-700">Capacity (Watts / Ah / kVA)</Label>
                    <Input
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      placeholder="400W"
                      className="mt-1.5 h-12 text-base"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div>
                    <Label className="text-base font-semibold text-gray-700">
                      Make product visible once approved
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      The product will be listed on the platform immediately after admin approval
                    </p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-300"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1 order-2 sm:order-1 h-12 text-base"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white order-1 sm:order-2 h-12 text-base"
                  >
                    {loading ? "Saving..." : "Save and submit for review"}
                  </Button>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  Saving will submit this product for admin review before it goes live.
                </p>
              </div>

              {/* Right Column - Image Upload */}
              <div className="lg:w-96 xl:w-[420px] flex-shrink-0">
                <Label className="text-base font-semibold text-gray-700">Product images</Label>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`mt-2 rounded-xl p-8 text-center transition-all cursor-pointer border-2 border-dashed ${
                    isDragging 
                      ? "border-orange-500 bg-orange-50" 
                      : "border-gray-300 bg-gray-50 hover:border-orange-500 hover:bg-orange-50/50"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadingImages ? (
                    <div className="py-4">
                      <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-orange-500" />
                      <p className="text-base text-gray-600">Uploading images...</p>
                    </div>
                  ) : (
                    <>
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-colors ${
                        isDragging ? "bg-orange-100" : "bg-gray-100"
                      }`}>
                        <Upload className={`w-6 h-6 transition-colors ${isDragging ? "text-orange-500" : "text-gray-400"}`} />
                      </div>
                      <p className="text-base font-medium text-gray-700">Upload primary image</p>
                      <p className="text-sm text-gray-400 mt-1">PNG, JPG or WEBP — min 800×800px</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        await handleImageUpload(files);
                      }
                    }}
                  />
                </div>

                <div className="mt-4">
                  <div className="grid grid-cols-4 gap-3">
                    {imagePreviews.map((item, index) => (
                      <div key={index} className="relative aspect-square group">
                        <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200 bg-white">
                          {item.isUploading ? (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                            </div>
                          ) : (
                            <Image
                              src={item.url}
                              alt={`Product image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}

                    {Array.from({ length: 4 - imagePreviews.length }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
                      >
                        <Plus className="w-6 h-6 text-gray-400" />
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-400 mt-3">
                    {imagePreviews.length} of 4 images used
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}