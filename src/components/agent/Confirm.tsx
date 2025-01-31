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
const Confirm = ({bookingInfo}) => {
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
              <dt className="text-muted-foreground">Lead Passenger Name</dt>
              <dd>Sanzad International</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">City</dt>
              <dd>Delhi</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Service</dt>
              <dd>25 Dec 2024</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Vehicle</dt>
              <dd>Minivan 5</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Vehicle Number</dt>
              <dd>Dl-AS1212</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Driver Number</dt>
              <dd>XXXXXXXXXXX</dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter>
            <p>Thanks! Happy Journey😊</p>
        </CardFooter>
    </Card>
    </div>
  )
}

export default Confirm