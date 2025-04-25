// import {
//     Card,
//     CardHeader,
//     CardTitle,
//     CardContent,
//     CardDescription,
//     CardFooter,
//   } from "../ui/card";
//   import { useEffect } from "react";
//   import { CircleCheckBig } from "lucide-react";
//   import { Separator } from "../ui/separator";
//   const Confirm = ({ bookingInfo }) => {
//     useEffect(() => {
//       console.log("Confirm Page - bookingInfo:", bookingInfo);
//   }, [bookingInfo]);
//     if (!bookingInfo) {
//       return <p>Loading...</p>;
//     }
  
//     return (
//       <div className="flex justify-center items-center">
//         <Card className="w-1/2">
//           <CardHeader>
//             <CardTitle>Booking Status</CardTitle>
//             <CardDescription>Your Booking is under review. We request you to kindly be patient. You will get a confirmation on your registered email once we verify your booking and confirm your payment.</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-1">
//               <CircleCheckBig width={20} height={20} />
//               <Separator className="shrink" />
//             </div>
//             <dl className="">
//               <div className="flex flex-col">
//                 <dt className="text-muted-foreground">Booking ID</dt>
//                 <dd>{bookingInfo.orderId || "N/A"}</dd> {/* ✅ Display booking_id */}
//               </div>
//               <div className="flex justify-between">
//                 <dt className="text-muted-foreground">Lead Passenger Name</dt>
//                 <dd>{bookingInfo?.passenger?.name || "N/A"}</dd>
//               </div>
//               <div className="flex justify-between">
//                 <dt className="text-muted-foreground">Lead Passenger Name</dt>
//                 <dd>{bookingInfo?.passenger?.email || "N/A"}</dd>
//               </div>
//               <div className="flex justify-between">
//                 <dt className="text-muted-foreground">Lead Passenger Name</dt>
//                 <dd>{bookingInfo?.passenger?.mobile || "N/A"}</dd>
//               </div>
//               <div className="flex justify-between">
//                 <dt className="text-muted-foreground">Pickup Location</dt>
//                 <dd>{bookingInfo.pickup || "N/A"}</dd>
//               </div>
//               <div className="flex justify-between">
//                 <dt className="text-muted-foreground">Drop-off Location</dt>
//                 <dd>{bookingInfo.dropoff || "N/A"}</dd>
//               </div>
//               <div className="flex justify-between">
//                 <dt className="text-muted-foreground">Vehicle</dt>
//                 <dd>{bookingInfo.vehicle?.brand || "N/A"}</dd>
//               </div>
//             </dl>
//           </CardContent>
//           <CardFooter>
//             <p>We are happy to serve you. For further query write to support@sanzadinternational.com😊</p>
//           </CardFooter>
//         </Card>
//       </div>
//     );
//   };
  
//   export default Confirm;
  

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { useEffect } from "react";
import { CircleCheckBig } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button"; // Assuming you have a Button component
import { useRouter} from "next/navigation";

const Confirm = ({ bookingInfo }) => {
  const router = useRouter();
  
  useEffect(() => {
    console.log("Confirm Page - bookingInfo:", bookingInfo);
  }, [bookingInfo]);

  if (!bookingInfo) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center p-4">
      <Card className="w-full md:w-1/2 lg:w-1/2">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Booking Status</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Your Booking is under review. We request you to kindly be patient. You will get a confirmation on your registered email once we verify your booking and confirm your payment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 mb-4">
            <CircleCheckBig className="w-5 h-5 text-green-500" />
            <Separator className="flex-1" />
          </div>
          <dl className="space-y-4">
            <div className="flex flex-col">
              <dt className="text-muted-foreground text-sm md:text-base">Booking ID</dt>
              <dd className="font-medium">{bookingInfo.orderId || "N/A"}</dd>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between">
              <dt className="text-muted-foreground text-sm md:text-base">Passenger Name</dt>
              <dd className="font-medium">{bookingInfo?.passenger?.name || "N/A"}</dd>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between">
              <dt className="text-muted-foreground text-sm md:text-base">Email</dt>
              <dd className="font-medium">{bookingInfo?.passenger?.email || "N/A"}</dd>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between">
              <dt className="text-muted-foreground text-sm md:text-base">Mobile</dt>
              <dd className="font-medium">{bookingInfo?.passenger?.mobile || "N/A"}</dd>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between">
              <dt className="text-muted-foreground text-sm md:text-base">Pickup Location</dt>
              <dd className="font-medium">{bookingInfo.pickup || "N/A"}</dd>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between">
              <dt className="text-muted-foreground text-sm md:text-base">Drop-off Location</dt>
              <dd className="font-medium">{bookingInfo.dropoff || "N/A"}</dd>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between">
              <dt className="text-muted-foreground text-sm md:text-base">Vehicle</dt>
              <dd className="font-medium">{bookingInfo.vehicle?.brand || "N/A"}</dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          <p className="text-center text-sm md:text-base">
            We are happy to serve you. For further query write to support@sanzadinternational.com 😊
          </p>
          <Button 
            onClick={() => router.push('/')}
            className="w-full md:w-auto"
            variant="outline"
          >
            Return to Home Page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Confirm;