import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter,
  } from "../ui/card";
  import { CircleCheckBig } from "lucide-react";
  import { Separator } from "../ui/separator";
  const Confirm = ({ bookingInfo }) => {
    if (!bookingInfo) {
      return <p>Loading...</p>;
    }
  
    return (
      <div className="flex justify-center items-center">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Confirmation</CardTitle>
            <CardDescription>Booking is confirmed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1">
              <CircleCheckBig width={20} height={20} />
              <Separator className="shrink" />
            </div>
            <dl className="">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Booking ID</dt>
                <dd>{bookingInfo.booking_id || "N/A"}</dd> {/* ✅ Display booking_id */}
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Lead Passenger Name</dt>
                <dd>{bookingInfo.name || "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Pickup Location</dt>
                <dd>{bookingInfo.pickup_location || "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Drop-off Location</dt>
                <dd>{bookingInfo.drop_location || "N/A"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Vehicle</dt>
                <dd>{bookingInfo.vehicle?.brand || "N/A"}</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <p>Thanks! Happy Journey😊</p>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  export default Confirm;
  