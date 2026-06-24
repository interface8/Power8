"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import {
  useOrder,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
  useUpdateShippingStatus,
} from "@/hooks/use-admin-order";
import { OrderStatus, PaymentStatus, ShippingStatus } from "@/types/order";
import { OrderHeader } from "@/components/admin/orders/orders-id/OrderHeader";
import { OrderSummary } from "@/components/admin/orders/orders-id/OrderSummary";
import { OrderItemsTable } from "@/components/admin/orders/orders-id/OrderItemsTable";
import { CreditAccountSummary } from "@/components/admin/orders/orders-id/CreditAccountSummary";
import { PaymentScheduleTable } from "@/components/admin/orders/orders-id/PaymentScheduleTable";
import { OrderStatusControl } from "@/components/admin/orders/status-control/OrderStatusControl";
import { PaymentStatusControl } from "@/components/admin/orders/payment/PaymentStatusControl";
import { ShippingControl } from "@/components/admin/orders/status-control/ShippingControl";
import { ConfirmationModal } from "@/components/admin/orders/orders-id/ConfirmationModal";
import { Toast } from "@/components/admin/orders/orders-id/Toast";
import OrderDetailsLoading from "@/components/admin/orders/orders-id/OrdersLoading";

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;

  const { data, isLoading, refetch } = useOrder(orderId);
  const order = data?.data;

  const updateOrderStatusMutation = useUpdateOrderStatus();
  const updatePaymentMutation = useUpdatePaymentStatus();
  const updateShippingMutation = useUpdateShippingStatus();

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({ isOpen: false, title: "", message: "", action: () => {} });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") =>
    setToast({ message, type });
  const closeModal = () =>
    setModalConfig((prev) => ({ ...prev, isOpen: false }));

  const handleUpdateOrderStatus = (status: OrderStatus) => {
    setModalConfig({
      isOpen: true,
      title: "Update Order Status",
      message: `Are you sure you want to change order status to ${status.replace("_", " ")}?`,
      action: async () => {
        try {
          await updateOrderStatusMutation.mutateAsync({ id: orderId, status });
          showToast(
            `Order status updated to ${status.replace("_", " ")}`,
            "success",
          );
          refetch();
        } catch (error) {
          showToast(
            error instanceof Error
              ? error.message
              : "Failed to update order status",
            "error",
          );
        } finally {
          closeModal();
        }
      },
    });
  };

  const handleUpdatePaymentStatus = (status: PaymentStatus) => {
    setModalConfig({
      isOpen: true,
      title: "Update Payment Status",
      message: `Are you sure you want to mark payment as ${status.replace("_", " ")}?`,
      action: async () => {
        try {
          await updatePaymentMutation.mutateAsync({ id: orderId, status });
          showToast(
            `Payment status updated to ${status.replace("_", " ")}`,
            "success",
          );
          refetch();
        } catch (error) {
          showToast(
            error instanceof Error
              ? error.message
              : "Failed to update payment status",
            "error",
          );
        } finally {
          closeModal();
        }
      },
    });
  };

  const handleUpdateShippingStatus = async (
    status: ShippingStatus,
    trackingNumber?: string,
    shippingProvider?: string,
  ) => {
    try {
      await updateShippingMutation.mutateAsync({
        id: orderId,
        status,
        trackingNumber,
        shippingProvider,
      });
      showToast(`Shipping status updated to ${status}`, "success");
      refetch();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to update shipping status",
        "error",
      );
    }
  };

  if (isLoading || !order) {
    return <OrderDetailsLoading />;
  }

  return (
    <div className="w-full">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={modalConfig.action}
        title={modalConfig.title}
        message={modalConfig.message}
        isLoading={
          updateOrderStatusMutation.isPending || updatePaymentMutation.isPending
        }
      />

      <div className="space-y-4 sm:space-y-6">
        <OrderHeader
          orderId={order.id}
          orderStatus={order.orderStatus}
          createdAt={order.createdAt}
        />

        {/* <OrderSummary
          customerName={order.customer.name}
          customerEmail={order.customer.email}
          totalAmount={order.totalAmount}
          paymentType={order.paymentType}
          paymentStatus={order.paymentStatus}
        /> */}

        <OrderSummary
          customerName={order.customer.name}
          customerEmail={order.customer.email}
          customerPhone={order.customer.phone}
          totalAmount={order.totalAmount}
          paymentType={order.paymentType}
          paymentStatus={order.paymentStatus}
          orderStatus={order.orderStatus}
          orderDate={order.createdAt}
          orderId={order.id}
          installationAddress={order.installationAddress}
          city={order.city}
          state={order.state}
          shippingStatus={order.shipping.status}
          trackingNumber={order.shipping.trackingNumber}
          shippingProvider={order.shipping.shippingProvider}
          totalPaid={order.payment.totalPaid}
          remainingBalance={order.payment.remainingBalance}
          itemCount={order.items.length}
        />

        <OrderItemsTable items={order.items} totalAmount={order.totalAmount} />

        {order.paymentType === "CREDIT" && order.credit && (
          <>
            <CreditAccountSummary credit={order.credit} />
            <PaymentScheduleTable schedules={order.credit.schedules} />
          </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <OrderStatusControl
            currentStatus={order.orderStatus}
            onUpdateStatus={handleUpdateOrderStatus}
            isLoading={updateOrderStatusMutation.isPending}
          />

          <PaymentStatusControl
            currentStatus={order.paymentStatus}
            paymentType={order.paymentType}
            totalAmount={order.totalAmount}
            totalPaid={order.payment.totalPaid}
            onUpdateStatus={handleUpdatePaymentStatus}
            isLoading={updatePaymentMutation.isPending}
          />

          <div className="lg:col-span-2">
            <ShippingControl
              currentStatus={order.shipping.status}
              trackingNumber={order.shipping.trackingNumber}
              shippingProvider={order.shipping.shippingProvider}
              canUpdate={
                order.orderStatus === "CONFIRMED" ||
                order.orderStatus === "PROCESSING" ||
                order.orderStatus === "SHIPPED"
              }
              onUpdateStatus={handleUpdateShippingStatus}
              isLoading={updateShippingMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
