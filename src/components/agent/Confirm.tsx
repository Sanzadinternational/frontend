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
  const Confirm = ({ bookingInfo }) => {
    useEffect(() => {
      console.log("Confirm Page - bookingInfo:", bookingInfo);
  }, [bookingInfo]);
    if (!bookingInfo) {
      return <p>Loading...</p>;
    }
  
    return (
      <div className="flex justify-center items-center">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
            <CardDescription>Your Booking is under review. We request you to kindly be patient. You will get a confirmation on your registered email once we verify your booking and confirm your payment.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1">
              <CircleCheckBig width={20} height={20} />
              <Separator className="shrink" />
            </div>
            <dl className="">
              <div className="flex flex-col">
                <dt className="text-muted-foreground">Booking ID</dt>
                <dd>{bookingInfo.orderId || "N/A"}</dd> {/* ✅ Display booking_id */}
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Lead Passenger Name</dt>
                <dd>{bookingInfo?.passenger?.name || "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Lead Passenger Name</dt>
                <dd>{bookingInfo?.passenger?.email || "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Lead Passenger Name</dt>
                <dd>{bookingInfo?.passenger?.mobile || "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Pickup Location</dt>
                <dd>{bookingInfo.pickup || "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Drop-off Location</dt>
                <dd>{bookingInfo.dropoff || "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Vehicle</dt>
                <dd>{bookingInfo.vehicle?.brand || "N/A"}</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <p>We are happy to serve you. For further query write to support@sanzadinternational.com😊</p>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  export default Confirm;
  