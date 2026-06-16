"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useCart } from "@/components/providers/cart-providers";

import {
  AddressData,
  CreditDetails,
  IdentityData,
  sanitizeInput,
  validateBVN,
  validateNIN,
  calculateCreditBreakdown,
} from "./checkoutUtils";

import { PaymentMethodSection } from "./sections/PaymentMethodSection";
import { PaymentChannelSection } from "./sections/PaymentChannelSection";
import { AddressSection } from "./sections/AddressSection";
import { CreditDetailsSection } from "./sections/CreditDetailsSection";
import { IdentityVerificationSection } from "./sections/IdentityVerificationSection";
import { OrderSummarySection } from "./sections/OrderSummarySection";

type PaymentMethod = "full" | "installment";
type PaymentChannel = "bank_transfer" | "paystack" | "card";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCart();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("full");
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannel>("paystack");

  const [installationAddress, setInstallationAddress] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    phoneNumber: "",
  });

  const [deliveryAddress, setDeliveryAddress] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    phoneNumber: "",
  });

  const [creditDetails, setCreditDetails] = useState<CreditDetails>({
    depositAmount: 0,
    durationAmount: 3,
  });

  const [identity, setIdentity] = useState<IdentityData>({
    bvn: "",
    nin: "",
  });

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const handlePaymentChannelChange = (channel: PaymentChannel) => {
    setPaymentChannel(channel);
  };

  const handleInstallationAddressChange = (
    field: keyof AddressData,
    value: string,
  ) => {
    setInstallationAddress((prev) => ({
      ...prev,
      [field]: sanitizeInput(value),
    }));
  };

  const handleDeliveryAddressChange = (
    field: keyof AddressData,
    value: string,
  ) => {
    setDeliveryAddress((prev) => ({
      ...prev,
      [field]: sanitizeInput(value),
    }));
  };

  const handleCreditChange = (field: keyof CreditDetails, value: number) => {
    setCreditDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleIdentityChange = (field: keyof IdentityData, value: string) => {
    setIdentity((prev) => ({ ...prev, [field]: sanitizeInput(value) }));
  };

  const items = useMemo(() => cart?.items ?? [], [cart]);

  /* -----------------------------
   PRICING
  ----------------------------- */

  const subtotal = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 0),
      0,
    );
  }, [items]);

  const vat = subtotal * 0.075;
  const total = subtotal + vat;

  /* -----------------------------
   CREDIT BREAKDOWN
  ----------------------------- */

  const creditBreakdown = useMemo(() => {
    return calculateCreditBreakdown(
      total,
      creditDetails.depositAmount,
      creditDetails.durationAmount,
    );
  }, [total, creditDetails.depositAmount, creditDetails.durationAmount]);

  /* -----------------------------
   VALIDATIONS
  ----------------------------- */

  const isBVNValid = validateBVN(identity.bvn);
  const isNINValid = validateNIN(identity.nin);
  const isIdentityVerified = isBVNValid && isNINValid;

  const isInstallationAddressValid =
    installationAddress.street.trim().length > 3 &&
    installationAddress.city.trim().length > 1 &&
    installationAddress.state.trim().length > 1 &&
    installationAddress.phoneNumber.trim().length >= 11;

  const isDeliveryAddressValid =
    deliveryAddress.street.trim().length > 3 &&
    deliveryAddress.city.trim().length > 1 &&
    deliveryAddress.state.trim().length > 1 &&
    deliveryAddress.phoneNumber.trim().length >= 11;

  const canSubmit =
    items.length > 0 &&
    isInstallationAddressValid &&
    isDeliveryAddressValid &&
    (paymentMethod === "full" ? true : isIdentityVerified);

  /* -----------------------------
   SUBMIT
  ----------------------------- */

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Please complete all required fields");
      return;
    }

    try {
      setLoading(true);

      // ── STEP 1: Build payload to match createOrderSchema ─────────────
      const orderPayload = {
        // "full" → "FULL", "installment" → "CREDIT"
        paymentType: paymentMethod === "full" ? "FULL" : "CREDIT",

        // Schema expects flat strings, not an object
        installationAddress: sanitizeInput(installationAddress.street),
        city: sanitizeInput(installationAddress.city),
        state: sanitizeInput(installationAddress.state),

        // Schema expects { itemType, productId?, bundleId?, quantity }
        // Adjust item.itemType / item.productId / item.bundleId to match
        // whatever field names your cart provider uses
        items: items.map((item) => ({
          itemType: item.itemType ?? "PRODUCT",       // "PRODUCT" | "BUNDLE"
          productId: item.productId ?? undefined,
          bundleId: item.bundleId ?? undefined,
          quantity: item.quantity,
        })),
      };

      // ── STEP 2: Create the order ──────────────────────────────────────
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json().catch(() => null);
        throw new Error(errorData?.message ?? "Order creation failed");
      }

      const order = await orderRes.json();

      // ── STEP 3: Initiate payment (bypass auto-confirms in dev) ────────
      const paymentRes = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      if (!paymentRes.ok) {
        const errorData = await paymentRes.json().catch(() => null);
        throw new Error(errorData?.message ?? "Payment initiation failed");
      }

      // ── STEP 4: Done ──────────────────────────────────────────────────
      toast.success(
        paymentMethod === "full"
          ? "Order placed successfully"
          : "Credit application submitted successfully",
      );

      setTimeout(() => {
        router.push(`/dashboard/orders/${order.id}`);
      }, 1800);

    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="
        min-h-screen bg-gray-50
        px-4 py-6
        sm:px-6 sm:py-8
        lg:px-8
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8">
          <h1
            className="
              text-2xl font-bold text-green-950
              sm:text-3xl
              lg:text-4xl
            "
          >
            Checkout
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Complete your order securely
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* LEFT SIDE */}
          <div className="space-y-6 xl:col-span-2">
            <PaymentMethodSection
              paymentMethod={paymentMethod}
              onChange={handlePaymentMethodChange}
            />

            {paymentMethod === "installment" && (
              <>
                <CreditDetailsSection
                  totalAmount={total}
                  values={creditDetails}
                  onChange={handleCreditChange}
                />
                <IdentityVerificationSection
                  values={identity}
                  onChange={handleIdentityChange}
                  isBVNValid={isBVNValid}
                  isNINValid={isNINValid}
                />
              </>
            )}

            <PaymentChannelSection
              paymentChannel={paymentChannel}
              onChange={handlePaymentChannelChange}
            />

            <AddressSection
              title="Installation Address"
              description="Where the solar system will be installed"
              values={installationAddress}
              onChange={handleInstallationAddressChange}
            />

            <AddressSection
              title="Delivery Address"
              description="Where the equipment should be delivered"
              values={deliveryAddress}
              onChange={handleDeliveryAddressChange}
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="xl:sticky xl:top-6 h-fit">
            <OrderSummarySection
              items={items}
              subtotal={subtotal}
              vat={vat}
              total={total}
              paymentMethod={paymentMethod}
              creditBreakdown={creditBreakdown}
              loading={loading}
              canSubmit={canSubmit}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        {/* EMPTY CART */}
        {items.length === 0 && (
          <div
            className="
              mt-8 rounded-3xl border
              border-dashed border-gray-300
              bg-white p-10 text-center
              shadow-sm
            "
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Your cart is empty
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Add products to continue checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}