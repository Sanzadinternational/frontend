"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-4xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-4 text-lg">Thank you for your payment. Your transaction was successful.</p>
      <Button onClick={handleBackToHome} className="mt-6">
        Back to Home
      </Button>
    </div>
  );
};

export default PaymentSuccess;
