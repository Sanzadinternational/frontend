// "use client";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";

// const PaymentSuccess = () => {
//   const router = useRouter();

//   const handleBackToHome = () => {
//     router.push("/");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
//       <h1 className="text-4xl font-bold text-green-600">Payment Successful!</h1>
//       <p className="mt-4 text-lg">Thank you for your payment. Your transaction was successful.</p>
//       <Button onClick={handleBackToHome} className="mt-6">
//         Back to Home
//       </Button>
//     </div>
//   );
// };

// export default PaymentSuccess;



"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const PaymentSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");
  const transactionId = searchParams.get("transactionId");
  const amount = searchParams.get("amount");
  const paymentMode = searchParams.get("paymentMode");

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-green-300">
        <CardHeader>
          <CardTitle className="text-green-600">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for your payment. Your transaction was successful.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-gray-700">
          {orderId && (
            <div>
              <span className="font-medium">Order ID:</span> {orderId}
            </div>
          )}
          {transactionId && (
            <div>
              <span className="font-medium">Transaction ID:</span> {transactionId}
            </div>
          )}
          {amount && (
            <div>
              <span className="font-medium">Amount:</span> {amount}
            </div>
          )}
          {paymentMode && (
            <div>
              <span className="font-medium">Payment Mode:</span> {paymentMode}
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button onClick={handleBackToHome} className="w-full">
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
