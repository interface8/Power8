"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  Package,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ApprovedProduct {
  id: string;
  name: string;
  categoryName: string;
  price: number;
  primaryImage: string | null;
}

interface BundleItem {
  merchantProductId: string;
  productName: string;
  quantity: number;
}

export default function NewBundlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [approvedProducts, setApprovedProducts] = useState<ApprovedProduct[]>([]);
  const [productSearch, setProductSearch] = useState("");

  // form state
  const [name, setName] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [systemCapacityKw, setSystemCapacityKw] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<BundleItem[]>([]);

  useEffect(() => {
    const fetchApprovedProducts = async () => {
      try {
        const res = await fetch("/api/merchant/products?approvalStatus=APPROVED&limit=100");
        const json = await res.json();
        if (res.ok) {
          setApprovedProducts(
            (json.data ?? []).map((p: { id: string; name: string; categoryName: string; price: number; primaryImage: string | null }) => ({
              id: p.id, name: p.name, categoryName: p.categoryName, price: Number(p.price), primaryImage: p.primaryImage,
            })),
          );
        }
      } catch { toast.error("Failed to load your products"); }
      finally { setProductsLoading(false); }
    };
    fetchApprovedProducts();
  }, []);

  const filteredProducts = approvedProducts.filter(
    (p) => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()),
  );

  const addProduct = (product: ApprovedProduct) => {
    if (items.some((i) => i.merchantProductId === product.id)) {
      toast.info("This product is already in the bundle");
      return;
    }
    setItems((prev) => [...prev, { merchantProductId: product.id, productName: product.name, quantity: 1 }]);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.merchantProductId !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => i.merchantProductId === productId ? { ...i, quantity: qty } : i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Bundle name is required"); return; }
    if (!totalPrice || Number(totalPrice) <= 0) { toast.error("Total price must be greater than 0"); return; }
    if (items.length === 0) { toast.error("Add at least one product to the bundle"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/merchant/bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          totalPrice: Number(totalPrice),
          ...(systemCapacityKw ? { systemCapacityKw: Number(systemCapacityKw) } : {}),
          ...(description.trim() ? { description: description.trim() } : {}),
          items: items.map((i) => ({ merchantProductId: i.merchantProductId, quantity: i.quantity })),
        }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.message || "Failed to create bundle"); return; }
      toast.success("Bundle submitted for review");
      router.push("/merchant/bundles");
    } catch { toast.error("Failed to create bundle"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/merchant/bundles")} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft className="w-4 h-4" /> Back to Bundles
        </button>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Bundle</h1>
        <p className="text-sm text-gray-500 mt-1">Package your approved products into a solar system bundle</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: bundle details */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Bundle Details</p>

              <div>
                <Label>Bundle Name <span className="text-red-500">*</span></Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-11" placeholder="e.g. 5kW Home Solar System" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Price (₦) <span className="text-red-500">*</span></Label>
                  <Input type="number" min="0" step="1000" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} className="mt-1 h-11" placeholder="e.g. 850000" />
                </div>
                <div>
                  <Label>System Capacity (kW)</Label>
                  <Input type="number" min="0" step="0.1" value={systemCapacityKw} onChange={(e) => setSystemCapacityKw(e.target.value)} className="mt-1 h-11" placeholder="e.g. 5" />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Brief description of this bundle…" />
              </div>
            </div>

            {/* Bundle items summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Bundle Items ({items.length})
              </p>
              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No products added yet</p>
                  <p className="text-xs mt-1">Select products from the right panel</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.merchantProductId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.productName}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button type="button" onClick={() => updateQuantity(item.merchantProductId, item.quantity - 1)} className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-bold flex items-center justify-center">−</button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.merchantProductId, item.quantity + 1)} className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-bold flex items-center justify-center">+</button>
                        <button type="button" onClick={() => removeItem(item.merchantProductId)} className="ml-1 text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Bundle for Review"}
            </Button>
          </div>

          {/* Right: product picker */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Your Approved Products</p>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search products…" className="pl-9 h-9" />
              </div>
              {productsLoading ? (
                <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />)}</div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No approved products found</p>
                  <p className="text-xs mt-1">Products must be approved before adding to bundles</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[480px] overflow-y-auto">
                  {filteredProducts.map((p) => {
                    const inBundle = items.some((i) => i.merchantProductId === p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => addProduct(p)}
                        disabled={inBundle}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${inBundle ? "bg-green-50 border-green-200 cursor-default" : "bg-gray-50 border-gray-200 hover:bg-orange-50 hover:border-orange-300"}`}
                      >
                        <Package className="w-4 h-4 text-gray-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.categoryName} · ₦{p.price.toLocaleString()}</p>
                        </div>
                        {inBundle ? (
                          <span className="text-xs text-green-600 shrink-0">Added</span>
                        ) : (
                          <Plus className="w-4 h-4 text-gray-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
