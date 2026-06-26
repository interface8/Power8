"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // ✅ ADDED THIS
} from "@/components/ui/dialog";
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
import Image from "next/image";
import type { Product, ProductCategory, Company } from "@/types/products";
import { X, Upload, Loader2 } from "lucide-react";

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSuccess: () => void;
  categories: ProductCategory[];
  companies: Company[];
}

interface ImageItem {
  url: string;
  file?: File;
  isUploading?: boolean;
}

export default function ProductModal({
  open,
  onOpenChange,
  product,
  onSuccess,
  categories,
  companies,
}: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    companyId: "",
    price: 0,
    stockQuantity: 0,
    warranty: 0,
    capacity: "",
    isActive: true,
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<ImageItem[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        categoryId: product.categoryId || "",
        companyId: product.companyId || "",
        price: product.price || 0,
        stockQuantity: product.stockQuantity || 0,
        warranty: product.warranty || 0,
        capacity: product.capacity?.toString() || "",
        isActive: product.isActive !== undefined ? product.isActive : true,
      });
      
      const existingImages = product.imageUrls || (product.imageUrl ? [product.imageUrl] : []);
      setImageUrls(existingImages);
      setImagePreviews(existingImages.map(url => ({ url, isUploading: false })));
    } else {
      setFormData({
        name: "",
        description: "",
        categoryId: "",
        companyId: "",
        price: 0,
        stockQuantity: 0,
        warranty: 0,
        capacity: "",
        isActive: true,
      });
      setImageUrls([]);
      setImagePreviews([]);
    }
  }, [product]);

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

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.companyId) {
      toast.error("Please select a company/brand");
      return;
    }

    setLoading(true);
    try {
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PATCH" : "POST";

      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity) || 0,
        imageUrls,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (res.ok) {
        toast.success(product ? "Product updated" : "Product created");
        onSuccess();
        onOpenChange(false);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to save product");
      }
    } catch {
      toast.error("Something went wrong");
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[95vw] md:w-[1000px] md:max-w-[1000px] max-h-[90vh] overflow-y-auto bg-gray-200 rounded-2xl shadow-2xl p-4 md:p-6">
        <DialogHeader className="pb-2 md:pb-4 mb-2 md:mb-4">
          <DialogTitle className="text-xl md:text-2xl font-bold text-gray-800">
            {product ? "Edit Product" : "Add Product"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {product 
              ? "Update the product details, category, company, and images." 
              : "Fill in the details to create a new product. All fields marked with * are required."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left Column - Form */}
          <div className="flex-1 space-y-4 md:space-y-5">
            <div>
              <Label className="text-sm font-semibold text-gray-700">Product Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. 200W Monocrystalline Solar Panel"
                className="mt-1.5 bg-white/80"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">Description</Label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the product..."
                rows={4}
                className="w-full px-3 py-2 mt-1.5 bg-white/80 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">Category *</Label>
              <Select value={formData.categoryId} onValueChange={(v) => setFormData({ ...formData, categoryId: v })}>
                <SelectTrigger className="mt-1.5 bg-white/80">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">Company / Brand *</Label>
              <Select value={formData.companyId} onValueChange={(v) => setFormData({ ...formData, companyId: v })}>
                <SelectTrigger className="mt-1.5 bg-white/80">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((comp) => (
                    <SelectItem key={comp.id} value={comp.id}>{comp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700">Price (₦)</Label>
                <Input
                  type="text"
                  value={formatNumber(formData.price)}
                  onChange={(e) => handleNumberChange('price', e.target.value)}
                  placeholder="0"
                  className="mt-1.5 bg-white/80"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">Stock Quantity</Label>
                <Input
                  type="text"
                  value={formatNumber(formData.stockQuantity)}
                  onChange={(e) => handleNumberChange('stockQuantity', e.target.value)}
                  placeholder="0"
                  className="mt-1.5 bg-white/80"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700">Warranty (years)</Label>
                <Input
                  type="text"
                  value={formatNumber(formData.warranty)}
                  onChange={(e) => handleNumberChange('warranty', e.target.value)}
                  placeholder="e.g. 25"
                  className="mt-1.5 bg-white/80"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">Capacity</Label>
                <Input
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="e.g. 200W, 5KVA, 200Ah"
                  className="mt-1.5 bg-white/80"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 md:p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Label className="text-sm font-semibold text-gray-700">Product is active and visible to customers</Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 order-2 sm:order-1">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600 order-1 sm:order-2">
                {loading ? "Saving..." : product ? "Update Product" : "Save Product"}
              </Button>
            </div>
          </div>

          {/* Right Column - Multiple Image Upload */}
          <div className="w-full lg:w-96">
            <Label className="text-sm font-semibold text-gray-700">Product Images (Max 4)</Label>
            
            {/* Image URL Input */}
            <div className="mt-2">
              <div className="flex gap-2">
                <Input
                  id="image-url-input"
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 bg-white/80"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const urlInput = document.getElementById("image-url-input") as HTMLInputElement;
                    const url = urlInput?.value.trim();
                    if (url && /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(url)) {
                      if (imagePreviews.length >= 4) {
                        toast.error("Maximum 4 images allowed");
                        return;
                      }
                      setImagePreviews(prev => [...prev, { url, isUploading: false }]);
                      setImageUrls(prev => [...prev, url]);
                      urlInput.value = "";
                      toast.success("Image added from URL");
                    } else if (url) {
                      toast.error("Please enter a valid image URL (jpg, png, webp, gif)");
                    }
                  }}
                  className="border-gray-300 hover:bg-orange-50 hover:text-orange-600"
                >
                  Add URL
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Paste a direct image URL (JPG, PNG, WEBP, GIF)</p>
            </div>
            
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-3 rounded-xl p-4 md:p-6 text-center transition-all duration-200 cursor-pointer border-2 border-dashed ${
                isDragging 
                  ? "border-orange-500 bg-orange-50 scale-[1.02]" 
                  : "border-gray-300 bg-amber-50/50 hover:border-orange-500"
              }`}
              onClick={() => document.getElementById("image-input")?.click()}
            >
              {uploadingImages ? (
                <div className="py-8">
                  <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin text-orange-500" />
                  <p className="text-sm text-gray-600">Uploading images...</p>
                </div>
              ) : (
                <>
                  <Upload className={`w-8 h-8 mx-auto mb-2 transition-colors ${isDragging ? "text-orange-500" : "text-gray-400"}`} />
                  <p className="text-sm text-gray-600">Drag and drop images here or click to browse</p>
                  <p className="text-xs text-gray-400 mt-2">PNG, JPG, WEBP up to 5MB each</p>
                  <p className="text-xs text-orange-500 mt-1">Maximum 4 images</p>
                </>
              )}
              <input
                id="image-input"
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

            {/* Image Gallery */}
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">
                  {imagePreviews.length} of 4 images used
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {imagePreviews.map((item, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white">
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
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4 text-center">
              Tip: Use clear, well-lit product photos against a white background. First image will be the main thumbnail.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}