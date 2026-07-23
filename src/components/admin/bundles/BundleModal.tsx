"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { BundleDto } from "@/modules/bundles/types";

interface Product {
  id: string;
  name: string;
  price: number;
  categoryName: string;
  stockQuantity: number;
}

interface BundleItem {
  productId: string;
  quantity: number;
}

interface BundleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bundle: BundleDto | null;
  onSuccess: () => void;
}

export default function BundleModal({
  open,
  onOpenChange,
  bundle,
  onSuccess,
}: BundleModalProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [name, setName] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [systemCapacityKw, setSystemCapacityKw] = useState("");
  const [items, setItems] = useState<BundleItem[]>([{ productId: "", quantity: 1 }]);

  // Load products for the dropdown
  useEffect(() => {
    if (!open) return;
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch("/api/products?limit=100&page=1");
        const json = await res.json();
        if (res.ok) setProducts(json.data ?? json.products ?? []);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [open]);

  // Pre-fill form when editing
  useEffect(() => {
    if (bundle) {
      setName(bundle.name);
      setTotalPrice(bundle.totalPrice.toString());
      setSystemCapacityKw(bundle.systemCapacityKw?.toString() ?? "");
      setItems(
        bundle.items.length > 0
          ? bundle.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            }))
          : [{ productId: "", quantity: 1 }],
      );
    } else {
      setName("");
      setTotalPrice("");
      setSystemCapacityKw("");
      setItems([{ productId: "", quantity: 1 }]);
    }
  }, [bundle, open]);

  const addItem = () => {
    setItems((prev) => [...prev, { productId: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      toast.error("Bundle must have at least one item");
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof BundleItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Bundle name is required");
      return;
    }
    if (!totalPrice || isNaN(parseFloat(totalPrice)) || parseFloat(totalPrice) <= 0) {
      toast.error("Please enter a valid total price");
      return;
    }
    const hasEmptyProduct = items.some((item) => !item.productId);
    if (hasEmptyProduct) {
      toast.error("Please select a product for each bundle item");
      return;
    }
    const hasInvalidQty = items.some((item) => item.quantity < 1);
    if (hasInvalidQty) {
      toast.error("All quantities must be at least 1");
      return;
    }

    // Check for duplicate products in the bundle
    const productIds = items.map((i) => i.productId);
    const hasDuplicates = productIds.length !== new Set(productIds).size;
    if (hasDuplicates) {
      toast.error("Each product can only appear once in a bundle");
      return;
    }

    setLoading(true);
    try {
      const url = bundle ? `/api/admin/bundles/${bundle.id}` : "/api/admin/bundles";
      const method = bundle ? "PATCH" : "POST";

      const body = {
        name: name.trim(),
        totalPrice: parseFloat(totalPrice),
        ...(systemCapacityKw ? { systemCapacityKw: parseFloat(systemCapacityKw) } : {}),
        items: items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
        })),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(bundle ? "Bundle updated" : "Bundle created");
        onSuccess();
        onOpenChange(false);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to save bundle");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value: string) => {
    const raw = value.replace(/,/g, "");
    const num = parseFloat(raw);
    return isNaN(num) ? value : num.toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[95vw] md:w-[700px] md:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gray-100 rounded-2xl shadow-2xl p-4 md:p-6">
        <DialogHeader className="pb-2 mb-2">
          <DialogTitle className="text-xl md:text-2xl font-bold text-gray-800">
            {bundle ? "Edit Bundle" : "Create Bundle"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {bundle
              ? "Update the bundle details and items."
              : "Create a new product bundle. Select products and set quantities."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Bundle name */}
          <div>
            <Label className="text-sm font-semibold text-gray-700">Bundle Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 3KVA Home Solar Package"
              className="mt-1.5 bg-white"
            />
          </div>

          {/* Price and capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700">Total Price (₦) *</Label>
              <Input
                type="text"
                value={totalPrice ? formatPrice(totalPrice) : ""}
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, "");
                  if (raw === "" || !isNaN(parseFloat(raw))) setTotalPrice(raw);
                }}
                placeholder="e.g. 450,000"
                className="mt-1.5 bg-white"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">
                System Capacity (kW){" "}
                <span className="text-gray-400 font-normal">optional</span>
              </Label>
              <Input
                type="number"
                value={systemCapacityKw}
                onChange={(e) => setSystemCapacityKw(e.target.value)}
                placeholder="e.g. 3.5"
                className="mt-1.5 bg-white"
                min={0}
                step={0.1}
              />
            </div>
          </div>

          {/* Bundle items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-semibold text-gray-700">
                Bundle Items *
              </Label>
              <span className="text-xs text-gray-400">{items.length} item{items.length !== 1 ? "s" : ""}</span>
            </div>

            {loadingProducts ? (
              <div className="flex items-center justify-center py-8 bg-white rounded-lg border">
                <Loader2 className="w-5 h-5 animate-spin text-orange-500 mr-2" />
                <span className="text-sm text-gray-500">Loading products...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="py-6 text-center bg-white rounded-lg border border-dashed">
                <p className="text-sm text-gray-500">
                  No products available. Create products first before creating a bundle.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-start bg-white p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <Select
                        value={item.productId}
                        onValueChange={(v) => updateItem(index, "productId", v)}
                      >
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              <div className="flex items-center justify-between gap-4 w-full">
                                <span>{product.name}</span>
                                <span className="text-xs text-gray-400 shrink-0">
                                  ₦{product.price.toLocaleString()}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {item.productId && (
                        <p className="text-xs text-gray-400 mt-1 pl-1">
                          {products.find((p) => p.id === item.productId)?.categoryName} ·{" "}
                          Stock: {products.find((p) => p.id === item.productId)?.stockQuantity ?? 0}
                        </p>
                      )}
                    </div>

                    <div className="w-24 shrink-0">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", parseInt(e.target.value) || 1)
                        }
                        min={1}
                        className="h-10 text-sm text-center"
                        placeholder="Qty"
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="h-10 w-10 p-0 shrink-0 hover:bg-red-100 hover:text-red-600 mt-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addItem}
                  className="w-full py-2.5 border-2 border-dashed border-orange-300 rounded-lg text-sm text-orange-500 hover:bg-orange-50 hover:border-orange-400 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add another item
                </button>
              </div>
            )}
          </div>

          {/* Price summary */}
          {items.some((i) => i.productId) && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-xs text-orange-700 font-medium mb-1">Price breakdown</p>
              {items
                .filter((i) => i.productId)
                .map((item, i) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <div key={i} className="flex justify-between text-xs text-gray-600 py-0.5">
                      <span>{product.name} × {item.quantity}</span>
                      <span>₦{(product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
              <div className="border-t border-orange-200 mt-2 pt-2 flex justify-between text-sm font-semibold text-orange-700">
                <span>Items subtotal</span>
                <span>
                  ₦{items
                    .filter((i) => i.productId)
                    .reduce((sum, item) => {
                      const product = products.find((p) => p.id === item.productId);
                      return sum + (product ? product.price * item.quantity : 0);
                    }, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || loadingProducts}
              className="flex-1 bg-orange-500 hover:bg-orange-600 order-1 sm:order-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : bundle ? (
                "Update Bundle"
              ) : (
                "Create Bundle"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}