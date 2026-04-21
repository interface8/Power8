"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CreditCard } from "lucide-react";

export function QuickActionsCard() {
  const handleMakePayment = () => {
    alert("Make Payment clicked!\n\nPayment modal will be integrated later.");
  };

  return (
    <Card>
      <CardHeader className="pb-6">
        <CardTitle className="text-lg font-semibold text-green-950">
          Quick Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="px-8 pb-8 space-y-3">
        <Button
          size="lg"
          className="w-full bg-orange-400 hover:bg-orange-600 text-white font-medium text-base py-4 rounded-lg"
          onClick={handleMakePayment}
        >
          <CreditCard size={26} /> Make payment
        </Button>

        {/* View Payment button */}
        <Button
          variant="outline"
          size="lg"
          className="w-full bg-green-50 hover:bg-green-100 text-green-950 py-4 text-base font-medium rounded-lg border-gray-300"
        >
          View Payment History
        </Button>

        {/* Contact Support */}
        <Button
          variant="outline"
          size="lg"
          className="w-full bg-green-50 hover:bg-green-100 text-green-950 py-4 text-base font-medium rounded-lg border-gray-300"
        >
          Contact Support
        </Button>
      </CardContent>
    </Card>
  );
}
