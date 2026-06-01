"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { X } from "lucide-react";

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSuccess: () => void;
  categories: ProductCategory[];
  companies: Company[];
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
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState("");

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
        imageUrl: product.imageUrl || "",
      });
      setImagePreview(product.imageUrl || "");
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
        imageUrl: "",
      });
      setImagePreview("");
    }
  }, [product]);

  const handleImageUpload = async (file: File) => {
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formDataObj });
      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
        setImagePreview(data.url);
        toast.success("Image uploaded");
      } else {
        toast.error("Failed to upload image");
      }
    } catch {
      toast.error("Failed to upload image");
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      await handleImageUpload(file);
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
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        companyId: formData.companyId,
        price: formData.price,
        stockQuantity: formData.stockQuantity,
        warranty: formData.warranty,
        capacity: parseInt(formData.capacity) || 0,
        isActive: formData.isActive,
        imageUrl: formData.imageUrl && formData.imageUrl.trim() !== "" ? formData.imageUrl : undefined,
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
    return value.toLocaleString();
  };

  const handleNumberChange = (field: 'price' | 'stockQuantity' | 'warranty', value: string) => {
    const rawValue = value.replace(/,/g, '');
    const num = field === 'price' ? parseFloat(rawValue) : parseInt(rawValue);
    setFormData({ ...formData, [field]: isNaN(num) ? 0 : num });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[95vw] md:w-[1000px] md:max-w-[1000px] max-h-[90vh] overflow-y-auto bg-gray-200 rounded-2xl shadow-2xl p-4 md:p-6">
        <DialogHeader className="pb-2 md:pb-4 mb-2 md:mb-4">
          <DialogTitle className="text-xl md:text-2xl font-bold text-gray-800">
            {product ? "Edit Product" : "Add Product"}
          </DialogTitle>
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
                  className="mt-1.5 bg-white/80"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-700">Stock Quantity</Label>
                <Input
                  type="text"
                  value={formatNumber(formData.stockQuantity)}
                  onChange={(e) => handleNumberChange('stockQuantity', e.target.value)}
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

          {/* Right Column - Image Upload */}
          <div className="w-full lg:w-96">
            <Label className="text-sm font-semibold text-gray-700">Product Image</Label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="mt-2 rounded-xl p-4 md:p-8 text-center hover:border-orange-500 transition cursor-pointer bg-amber-50/50 border-2 border-dashed border-gray-300"
              onClick={() => document.getElementById("image-input")?.click()}
            >
              {imagePreview ? (
                <div className="relative inline-block">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover max-h-48 w-auto mx-auto"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview("");
                      setFormData({ ...formData, imageUrl: "" });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-4xl md:text-5xl mb-2 md:mb-3">📷</div>
                  <p className="text-xs md:text-sm text-gray-600">Drag and drop image here or click to browse</p>
                  <p className="text-xs text-gray-400 mt-2">PNG, JPG, WEBP up to 5MB</p>
                  <p className="text-xs text-gray-400">Recommended: 800×800px, square format</p>
                </>
              )}
              <input
                id="image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleImageUpload(file);
                  }
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-3 md:mt-4 text-center">
              Tip: Use clear, well-lit product photos against a white background for the best customer experience.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}