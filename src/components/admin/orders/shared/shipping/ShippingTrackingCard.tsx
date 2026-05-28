"use client";

interface Props {
  trackingNumber: string;

  shippingProvider: string | null;
}

export function ShippingTrackingCard({
  trackingNumber,
  shippingProvider,
}: Props) {
  return (
    <div
      className="
        rounded-2xl
        border border-orange-100
        bg-white px-4 py-3
      "
    >
      <p
        className="
          text-xs font-medium
          uppercase tracking-wide
          text-gray-500
        "
      >
        Tracking Number
      </p>

      <p
        className="
          mt-1 break-all
          font-semibold text-gray-900
        "
      >
        {trackingNumber}
      </p>

      {shippingProvider && (
        <p className="mt-1 text-sm text-gray-500">
          {shippingProvider}
        </p>
      )}
    </div>
  );
}