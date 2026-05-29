// "use client";

// import { useState } from "react";
// import { useCart } from "@/components/providers/cart-providers";

// export default function CheckoutPage() {
//   const { cart } = useCart();

//   const [paymentMethod, setPaymentMethod] = useState<"full" | "installment">(
//     "full",
//   );

//   const items = cart?.items ?? [];
//   const subtotal = items.reduce(
//     (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 0),
//     0,
//   );

//   const vat = subtotal * 0.075;
//   const total = subtotal + vat;

//   return (
//     <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-10">
//       <div className="max-w-7xl mx-auto">
//         {/* Title */}
//         <h1 className="text-2xl sm:text-3xl font-bold text-green-950 mb-8">
//           Checkout
//         </h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* LEFT */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Payment method */}
//             <div className="bg-white rounded-xl border p-6">
//               <h2 className="text-lg font-semibold text-green-950 mb-4">
//                 Payment Method
//               </h2>

//               {/* Full Payment */}
//               <div
//                 onClick={() => setPaymentMethod("full")}
//                 className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition ${
//                   paymentMethod === "full"
//                     ? "border-green-600 bg-green-50"
//                     : "border-gray-200"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-3 h-3 rounded-full bg-green-700" />
//                   <span className="font-medium">Full Payment</span>
//                   <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">
//                     Recommended
//                   </span>
//                 </div>

//                 <p className="text-sm text-gray-600 max-w-xs">
//                   Pay the full amount now and get your system installed
//                   immediately
//                 </p>
//               </div>

//               {/* Installment */}
//               <div
//                 onClick={() => setPaymentMethod("installment")}
//                 className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer mt-4 transition ${
//                   paymentMethod === "installment"
//                     ? "border-orange-500 bg-orange-50"
//                     : "border-gray-200"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-3 h-3 rounded-full bg-orange-500" />
//                   <span className="font-medium">Pay Small Small</span>
//                   <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
//                     Flexible
//                   </span>
//                 </div>

//                 <p className="text-sm text-gray-600 max-w-xs">
//                   Make a deposit and pay the rest in monthly installments
//                 </p>
//               </div>
//             </div>

//             {/* Address */}
//             <div className="bg-white rounded-xl border p-6">
//               <h2 className="text-lg font-semibold text-green-950 mb-6">
//                 Installation Address
//               </h2>

//               <div className="space-y-5">
//                 <div>
//                   <label className="text-sm text-gray-700">
//                     Street Address
//                   </label>

//                   <input
//                     type="text"
//                     placeholder="e.g. 123 Main Street"
//                     className="
//         w-full mt-2 px-4 py-3
//         bg-green-50 border border-gray-200
//         rounded-lg text-sm
//         transition-all duration-200
//         focus:outline-none
//         focus:ring-2 focus:ring-green-500
//         focus:border-green-500
//         hover:border-gray-300
//       "
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-sm text-gray-700">City</label>
//                     <input
//                       type="text"
//                       placeholder="e.g. Lagos"
//                       className="
//           w-full mt-2 px-4 py-3
//           bg-green-50 border border-gray-200
//           rounded-lg text-sm
//           transition-all duration-200
//           focus:outline-none
//           focus:ring-2 focus:ring-green-500
//           focus:border-green-500
//           hover:border-gray-300
//         "
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm text-gray-700">State</label>
//                     <input
//                       type="text"
//                       placeholder="e.g. Lagos State"
//                       className="
//           w-full mt-2 px-4 py-3
//           bg-green-50 border border-gray-200
//           rounded-lg text-sm
//           transition-all duration-200
//           focus:outline-none
//           focus:ring-2 focus:ring-green-500
//           focus:border-green-500
//           hover:border-gray-300
//         "
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-sm text-gray-700">Phone Number</label>
//                   <input
//                     type="text"
//                     placeholder="e.g. +234 800 000 0001"
//                     className="
//         w-full mt-2 px-4 py-3
//         bg-green-50 border border-gray-200
//         rounded-lg text-sm
//         transition-all duration-200
//         focus:outline-none
//         focus:ring-2 focus:ring-green-500
//         focus:border-green-500
//         hover:border-gray-300
//       "
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/*  RIGHT */}
//           <div className="bg-white rounded-xl border p-6 h-fit">
//             <h2 className="text-lg font-semibold text-green-950 mb-6">
//               Order Summary
//             </h2>

//             {/* Items */}
//             <div className="space-y-3 text-sm text-gray-700">
//               {items.map((item) => (
//                 <div key={item.id} className="flex justify-between">
//                   <span>
//                     {item.productName} × {item.quantity}
//                   </span>

//                   <span>
//                     ₦
//                     {(
//                       (item.price ?? 0) * (item.quantity ?? 0)
//                     ).toLocaleString()}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <div className="border-t my-4" />

//             {/* Totals */}
//             <div className="space-y-2 text-sm text-gray-700">
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>₦{subtotal.toLocaleString()}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span>VAT (7.5%)</span>
//                 <span>₦{vat.toLocaleString()}</span>
//               </div>
//             </div>

//             <div className="border-t my-4" />

//             <div className="flex justify-between text-lg font-bold text-green-950">
//               <span>Total</span>
//               <span className="text-orange-500">₦{total.toLocaleString()}</span>
//             </div>

//             {/* Buttons */}
//             <button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-medium transition">
//               Pay Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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

  const [paymentChannel, setPaymentChannel] =
    useState<PaymentChannel>("paystack");

  /* -----------------------------
   ADDRESS STATES
  ----------------------------- */

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

  /* -----------------------------
   CREDIT DETAILS
  ----------------------------- */

  const [creditDetails, setCreditDetails] = useState<CreditDetails>({
    depositAmount: 0,
    durationAmount: 3,
  });

  /* -----------------------------
   IDENTITY
  ----------------------------- */

  const [identity, setIdentity] = useState<IdentityData>({
    bvn: "",
    nin: "",
  });

  /* -----------------------------
   HANDLERS
  ----------------------------- */

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
    setCreditDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleIdentityChange = (field: keyof IdentityData, value: string) => {
    setIdentity((prev) => ({
      ...prev,
      [field]: sanitizeInput(value),
    }));
  };

  /* -----------------------------
   CART ITEMS
  ----------------------------- */

  const items = useMemo(() => {
    return cart?.items ?? [];
  }, [cart]);

  /* -----------------------------
   PRICING
  ----------------------------- */

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + (item.price ?? 0) * (item.quantity ?? 0);
    }, 0);
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

      const payload = {
        paymentMethod,
        paymentChannel,

        installationAddress: {
          street: sanitizeInput(installationAddress.street),
          city: sanitizeInput(installationAddress.city),
          state: sanitizeInput(installationAddress.state),
          phoneNumber: sanitizeInput(installationAddress.phoneNumber),
        },

        deliveryAddress: {
          street: sanitizeInput(deliveryAddress.street),
          city: sanitizeInput(deliveryAddress.city),
          state: sanitizeInput(deliveryAddress.state),
          phoneNumber: sanitizeInput(deliveryAddress.phoneNumber),
        },

        items,

        pricing: {
          subtotal,
          vat,
          total,
        },

        ...(paymentMethod === "installment" && {
          creditDetails,
          identity,
          creditBreakdown,
        }),
      };

      console.log("Checkout Payload:", payload);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        paymentMethod === "full"
          ? "Order placed successfully"
          : "Credit application submitted successfully",
      );

      setTimeout(() => {
        router.push("/dashboard");
      }, 1800);
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong. Please try again.");
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

          <p
            className="
              mt-2 text-sm text-gray-500
              sm:text-base
            "
          >
            Complete your order securely
          </p>
        </div>

        <div
          className="
            grid grid-cols-1 gap-6
            xl:grid-cols-3
          "
        >
          {/* LEFT SIDE */}
          <div
            className="
              space-y-6
              xl:col-span-2
            "
          >
            {/* PAYMENT METHOD */}
            <PaymentMethodSection
              paymentMethod={paymentMethod}
              onChange={handlePaymentMethodChange}
            />

            {/* CREDIT DETAILS */}
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

            {/* PAYMENT CHANNEL */}
            <PaymentChannelSection
              paymentChannel={paymentChannel}
              onChange={handlePaymentChannelChange}
            />

            {/* INSTALLATION ADDRESS */}
            <AddressSection
              title="Installation Address"
              description="Where the solar system will be installed"
              values={installationAddress}
              onChange={handleInstallationAddressChange}
            />

            {/* DELIVERY ADDRESS */}
            <AddressSection
              title="Delivery Address"
              description="Where the equipment should be delivered"
              values={deliveryAddress}
              onChange={handleDeliveryAddressChange}
            />
          </div>

          {/* RIGHT SIDE */}
          <div
            className="
              xl:sticky xl:top-6
              h-fit
            "
          >
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
            <h3
              className="
                text-lg font-semibold
                text-gray-900
              "
            >
              Your cart is empty
            </h3>

            <p
              className="
                mt-2 text-sm text-gray-500
              "
            >
              Add products to continue checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
