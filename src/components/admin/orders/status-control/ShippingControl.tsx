"use client";

import { useState } from "react";
import { ShippingStatus } from "@/types/order";
import { ShippingHeader } from "../shared/shipping/ShippingHeader";
import { ShippingActionButtons } from "../shared/shipping/ShippingActionButton";
import { ShippingStatusCard } from "../shared/shipping/ShippingStatusCard";
import { ShippingModal } from "../shared/shipping/ShippingModal";

interface ShippingControlProps {
  currentStatus: ShippingStatus;
  trackingNumber: string | null;
  shippingProvider: string | null;
  canUpdate: boolean;
  onUpdateStatus: (status: ShippingStatus, trackingNumber?: string, shippingProvider?: string) => void;
  isLoading: boolean;
}

export function ShippingControl({
  currentStatus,
  trackingNumber,
  shippingProvider,
  canUpdate,
  onUpdateStatus,
  isLoading,
}: ShippingControlProps) {
  const [showModal, setShowModal] = useState(false);
  const [newTrackingNumber, setNewTrackingNumber] = useState("");
  const [newShippingProvider, setNewShippingProvider] = useState("");

  const handleStatusClick = (status: ShippingStatus) => {
    if (status === "SHIPPED") {
      setShowModal(true);
      return;
    }
    onUpdateStatus(status);
  };

  const handleConfirmShipping = () => {
    if (!newTrackingNumber) return;
    onUpdateStatus("SHIPPED", newTrackingNumber, newShippingProvider);
    setShowModal(false);
    setNewTrackingNumber("");
    setNewShippingProvider("");
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm">
        <ShippingHeader />
        
        <div className="p-4 sm:p-6">
          <ShippingActionButtons
            currentStatus={currentStatus}
            canUpdate={canUpdate}
            isLoading={isLoading}
            onStatusClick={handleStatusClick}
          />
          
          <ShippingStatusCard
            currentStatus={currentStatus}
            trackingNumber={trackingNumber}
            shippingProvider={shippingProvider}
          />
        </div>
      </div>

      <ShippingModal
        isOpen={showModal}
        trackingNumber={newTrackingNumber}
        shippingProvider={newShippingProvider}
        isLoading={isLoading}
        onTrackingChange={setNewTrackingNumber}
        onProviderChange={setNewShippingProvider}
        onConfirm={handleConfirmShipping}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}