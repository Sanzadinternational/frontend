// import Image from "next/image";
// import { Users, Luggage, Backpack, BadgeInfo, Car, Map } from "lucide-react";
// import { ScrollArea, ScrollBar } from "../ui/scroll-area";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";

// import { Separator } from "../ui/separator";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardDescription,
//   CardFooter,
// } from "../ui/card";
// import { Button } from "../ui/button";
// const SearchResult = () => {
//   return (
//     <div className="flex flex-col md:flex-row gap-5">
//       <ScrollArea className="md:w-1/3 whitespace-nowrap rounded-md border">
//       <div className="md:h-96 flex flex-col px-2 py-4">
//         <Card>
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <CardTitle>Summary</CardTitle>
//               <Button variant="secondary">Edit Quote</Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-1">
//               <Car width={20} height={20} />
//               <Separator className="shrink" />
//             </div>
//             <dl className="">
//               <div className="flex justify-between">
//                 <dt className="text-muted-foreground">From</dt>
//                 <dd>Delhi</dd>
//               </div>
//               <div className="flex justify-between">
//                 <dt className="text-muted-foreground">To</dt>
//                 <dd>Noida</dd>
//               </div>
//               <div className="flex justify-between">
//                 <dt className="text-muted-foreground">Passengers</dt>
//                 <dd>4</dd>
//               </div>
//               <div className="flex justify-between">
//                 <dt className="text-muted-foreground">Date & Time</dt>
//                 <dd>25-Dec-24, 12:24PM</dd>
//               </div>
//               <div className="flex justify-between">
//                 <dt className="text-muted-foreground">Return Date & Time</dt>
//                 <dd>29-Dec-24, 10:24PM</dd>
//               </div>
//             </dl>
//             <div className="flex items-center gap-1">
//               <Map width={20} height={20} />
//               <Separator className="shrink" />
//             </div>
//             <dl>
//               <div className="flex justify-between">
//                 <dt className="text-muted-foreground">Estimated Trip Time</dt>
//                 <dd>30 mins</dd>
//               </div>
//               <div className="flex justify-between">
//                 <dt className="text-muted-foreground">Distance</dt>
//                 <dd>35.3 km</dd>
//               </div>
//             </dl>
//           </CardContent>
//           <CardFooter>
//             <Button variant="outline">Show Map</Button>
//           </CardFooter>
//         </Card>

//       </div>
//       </ScrollArea>
//       <ScrollArea className="md:w-2/3 whitespace-nowrap rounded-md border">
//         <h2 className="text-2xl px-4 pt-2">Available Vehicles</h2>
//         <div className="flex flex-col gap-5 p-4 md:h-96">
//           <Card className="">
//             <CardHeader>
//               <CardTitle>Car Name</CardTitle>
//               <CardDescription>Standard Service</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col gap-5 md:flex-row justify-between">
//                 <div className="w-auto md:w-[75%] flex flex-col md:flex-row md:justify-between">
//                   <Image
//                     src="/Sanzad-International-Hero-Image.jpg"
//                     width={250}
//                     height={100}
//                     alt="car"
//                     className="rounded-sm"
//                   />
//                   <div className="flex flex-col md:items-end justify-between">
//                     <dl className="px-2 py-1 text-sm">
//                       <div className="flex md:justify-end gap-1">
//                         <dt>Passengers</dt>
//                         <dd>10</dd>
//                         <Users width={15} height={15} />
//                       </div>
//                       <div className="flex md:justify-end gap-1">
//                         <dt>Medium</dt>
//                         <dd>5</dd>
//                         <Luggage width={15} height={15} />
//                       </div>
//                       <div className="flex md:justify-end gap-1">
//                         <dt>Small</dt>
//                         <dd>8</dd>
//                         <Backpack width={15} height={15} />
//                       </div>
//                     </dl>
//                     <HoverCard>
//                       <HoverCardTrigger className="flex items-center text-blue-500 cursor-pointer">
//                         <BadgeInfo width={15} height={15} />
//                         Transfer Info
//                       </HoverCardTrigger>
//                       <HoverCardContent className="w-80 text-wrap">
//                         Lorem ipsum dolor sit amet consectetur adipisicing elit.
//                         Non facilis, dolor quis voluptates quas distinctio hic
//                         in?
//                       </HoverCardContent>
//                     </HoverCard>
//                   </div>
//                 </div>
//                 <div className="w-1/2 md:w-[25%] bg-slate-50 dark:bg-slate-800 rounded-sm px-2 py-1 flex flex-col justify-between">
//                   <div>
//                     <p>One Way</p>
//                     <h2 className="text-2xl font-medium">Rs 345</h2>
//                   </div>
//                   <div>
//                     <Button className="w-full">Book Now</Button>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter>
//               <Button variant="outline" className="mr-1">
//                 Email Quote
//               </Button>
//               <Button variant="outline">Round Trip Qoute</Button>
//             </CardFooter>
//           </Card>
//           <Card className="">
//             <CardHeader>
//               <CardTitle>Car Name</CardTitle>
//               <CardDescription>Standard Service</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col gap-5 md:flex-row justify-between">
//                 <div className="w-auto md:w-[75%] flex flex-col md:flex-row md:justify-between">
//                   <Image
//                     src="/Sanzad-International-Hero-Image.jpg"
//                     width={250}
//                     height={100}
//                     alt="car"
//                     className="rounded-sm"
//                   />
//                   <div className="flex flex-col md:items-end justify-between">
//                     <dl className="px-2 py-1 text-sm">
//                       <div className="flex md:justify-end gap-1">
//                         <dt>Passengers</dt>
//                         <dd>10</dd>
//                         <Users width={15} height={15} />
//                       </div>
//                       <div className="flex md:justify-end gap-1">
//                         <dt>Medium</dt>
//                         <dd>5</dd>
//                         <Luggage width={15} height={15} />
//                       </div>
//                       <div className="flex md:justify-end gap-1">
//                         <dt>Small</dt>
//                         <dd>8</dd>
//                         <Backpack width={15} height={15} />
//                       </div>
//                     </dl>
//                     <HoverCard>
//                       <HoverCardTrigger className="flex items-center text-blue-500 cursor-pointer">
//                         <BadgeInfo width={15} height={15} />
//                         Transfer Info
//                       </HoverCardTrigger>
//                       <HoverCardContent className="w-80 text-wrap">
//                         Lorem ipsum dolor sit amet consectetur adipisicing elit.
//                         Non facilis, dolor quis voluptates quas distinctio hic
//                         in?
//                       </HoverCardContent>
//                     </HoverCard>
//                   </div>
//                 </div>
//                 <div className="w-1/2 md:w-[25%] bg-slate-50 dark:bg-slate-800 rounded-sm px-2 py-1 flex flex-col justify-between">
//                   <div>
//                     <p>One Way</p>
//                     <h2 className="text-2xl font-medium">Rs 345</h2>
//                   </div>
//                   <div>
//                     <Button className="w-full">Book Now</Button>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter>
//               <Button variant="outline" className="mr-1">
//                 Email Quote
//               </Button>
//               <Button variant="outline">Round Trip Qoute</Button>
//             </CardFooter>
//           </Card>
//         </div>
//         {/* <ScrollBar orientation="horizontal" /> */}
//       </ScrollArea>
//     </div>
//   );
// };

// export default SearchResult;

"use client";
import { useState } from "react";
import Image from "next/image";
import { useBooking } from "../context/BookingContext"; // Use your context here
import { Users, Luggage, BadgeInfo, Car, Map } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Separator } from "../ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import Location from "../Location";
import LocationMap from "./LocationMap";
const SearchResult = ({ onSelect }) => {
  const { bookingData } = useBooking();
  const { formData = {}, responseData = [] } = bookingData; // Add fallback values
  const { pickup, dropoff, pax, date, time,returnDate,returnTime,pickupLocation,dropoffLocation } = formData;
  const [displayForm, setDisplayForm] = useState(false);
  const [map, setMap] = useState(false);
  const showLocation = () => {
    setDisplayForm(!displayForm);
  };
  const showMap = () => {
    setMap(!map);
  };
  const handleBookNow = (vehicle) => {
    const bookingInfo = {
      pickup,
      dropoff,
      pax,
      date,
      time,
      returnDate,
      returnTime,
      pickupLocation,
      dropoffLocation,
      vehicle: {
        brand: vehicle?.brand,
        vehicalType: vehicle?.vehicalType,
        passengers: vehicle?.passengers,
        mediumBag: vehicle?.mediumBag,
        currency: vehicle?.currency,
        price: vehicle?.price,
        source: vehicle?.source,
      },
      extraCost: vehicle?.extraCost ||'0', // Example extra cost
    };

    onSelect(bookingInfo); // ✅ Send data to parent
  };

  const truncateText = (text, maxLength = 20) => {
    return text?.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };
  return (
    <>
      {displayForm && (
        <div className="flex items-center justify-center w-full mb-4">
          <Location />
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-5">
        {/* Summary Section */}
        <ScrollArea className="md:w-1/3 whitespace-nowrap rounded-md border">
          <div className="md:h-96 flex flex-col px-2 py-4 gap-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Summary</CardTitle>
                  <Button variant="secondary" onClick={showLocation}>
                    {displayForm ? "Hide" : "Modify Search"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1">
                  <Car width={20} height={20} />
                  <Separator className="shrink" />
                </div>
                <dl className="">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Pickup</dt>
                    <dd>{truncateText(pickup) || "N/A"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Dropoff</dt>
                    <dd>{truncateText(dropoff) || "N/A"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Passengers</dt>
                    <dd>{pax || "N/A"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Date & Time</dt>
                    <dd>
                      {date || "N/A"}, {time || "N/A"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Return Date & Time</dt>
                    <dd>
                      {returnDate || "N/A"}, {returnTime || "N/A"}
                    </dd>
                  </div>
                </dl>
                <div className="flex items-center gap-1">
                  <Map width={20} height={20} />
                  <Separator className="shrink" />
                </div>
                <dl>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      Estimated Trip Time
                    </dt>
                    <dd>N/A</dd> {/* Replace with actual data if available */}
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Distance</dt>
                    <dd>N/A</dd> {/* Replace with actual data if available */}
                  </div>
                </dl>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={showMap}>
                  {map ? "Hide Map" : "Show Map"}
                </Button>
              </CardFooter>
            </Card>
            {map && (
              <Card className="flex items-center justify-center p-2">
                <CardContent>
                  <LocationMap pickupLocation={pickupLocation} dropoffLocation={dropoffLocation}/>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Vehicles Section */}
        <ScrollArea className="md:w-2/3 whitespace-nowrap rounded-md border">
          <h2 className="text-2xl px-4 pt-2">Available Vehicles</h2>
          <div className="flex flex-col gap-5 p-4 md:h-96">
            {responseData.length > 0 ? (
              responseData.map((vehicle, index) => (
                <Card key={index} className="">
                  <CardHeader>
                    <CardTitle>{vehicle.brand}</CardTitle>
                    <CardDescription>{vehicle.vehicalType}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-5 md:flex-row justify-between">
                      <div className="w-auto md:w-[75%] flex flex-col md:flex-row md:justify-between">
                        <Image
                          src={
                            vehicle.image ||
                            "/Sanzad-International-Hero-Image.jpg"
                          } // Replace with vehicle image URL if available
                          width={250}
                          height={100}
                          alt={vehicle.brand}
                          className="rounded-sm"
                        />
                        <div className="flex flex-col md:items-end justify-between">
                          <dl className="px-2 py-1 text-sm">
                            <div className="flex md:justify-end gap-1">
                              <dt>Passengers</dt>
                              <dd>{vehicle.passengers}</dd>
                              <Users width={15} height={15} />
                            </div>
                            <div className="flex md:justify-end gap-1">
                              <dt>Medium Bags</dt>
                              <dd>{vehicle.mediumBag}</dd>
                              <Luggage width={15} height={15} />
                            </div>
                          </dl>
                          <HoverCard>
                            <HoverCardTrigger className="flex items-center text-blue-500 cursor-pointer">
                              <BadgeInfo width={15} height={15} />
                              Transfer Info
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80 text-wrap">
                              Provided by {vehicle.source}
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      </div>
                      <div className="w-1/2 md:w-[25%] bg-slate-50 dark:bg-slate-800 rounded-sm px-2 py-1 flex flex-col justify-between">
                        <div>
                          <p>One Way</p>
                          <h2 className="text-2xl font-medium">
                            {/* {vehicle.currency} {vehicle.price.toFixed(2)} */}
                            {vehicle.currency} {Number(vehicle.price).toFixed(2)}
                          </h2>
                        </div>
                        <div>
                          <Button
                            className="w-full"
                            onClick={() => handleBookNow(vehicle)}
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="mr-1">
                      Email Quote
                    </Button>
                    <Button variant="outline">Round Trip Quote</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>No vehicles available.</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default SearchResult;
