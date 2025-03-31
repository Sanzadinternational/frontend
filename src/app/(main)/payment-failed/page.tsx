"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const PaymentCancel = () => {
  const router = useRouter();

  const handleRetryPayment = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <h1 className="text-4xl font-bold text-red-600">Payment Failed</h1>
      <p className="mt-4 text-lg">Oops! Something went wrong with your payment.</p>
      <Button onClick={handleRetryPayment} className="mt-6">
        Try Again
      </Button>
    </div>
  );
};

export default PaymentCancel;
