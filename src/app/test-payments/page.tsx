"use client";

import { useEffect } from "react";

export default function TestApiPage() {
  useEffect(() => {
    async function test() {
      try {
        // 1. Orders
        const ordersRes = await fetch("/api/orders");
        const ordersData = await ordersRes.json();
        console.log("ORDERS:", ordersData);

        const orderId = ordersData?.data?.[0]?.id;
        if (!orderId) {
          console.log("❌ No order found");
          return;
        }

        // 2. Payments
        const paymentsRes = await fetch(`/api/payments/${orderId}`);
        const paymentsData = await paymentsRes.json();
        console.log("PAYMENTS:", paymentsData);

        // 3. Credit
        const creditRes = await fetch(`/api/credit/${orderId}`);
        const creditData = await creditRes.json();
        console.log("CREDIT:", creditData);

        const creditId = creditData?.data?.id;
        if (!creditId) {
          console.log("❌ No credit found");
          return;
        }

        // 4. Schedule
        const scheduleRes = await fetch(`/api/credit/schedule/${creditId}`);
        const scheduleData = await scheduleRes.json();
        console.log("SCHEDULE:", scheduleData);
      } catch (err) {
        console.error("ERROR:", err);
      }
    }

    test();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold ">Check Console for API Results</h1>
    </div>
  );
}
