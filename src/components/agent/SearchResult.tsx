"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Users, Luggage, BadgeInfo, Car, Map } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { fetchWithAuth } from "@/components/utils/api";
import { removeToken } from "@/components/utils/auth";
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
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";
const SearchResult = ({ onSelect, formData, vehicles, loading, distance }) => {
  console.log("Received Form Data:", formData);
  console.log("Available Vehicles:", vehicles);
  const [userData, setUserData] = useState<any>(null);
  const {
    pickup,
    dropoff,
    pax,
    date,
    time,
    returnDate,
    returnTime,
    pickupLocation,
    dropoffLocation,
  } = formData;
  const [displayForm, setDisplayForm] = useState(false);
  const [map, setMap] = useState(false);
  const [isLoadingOneWay, setIsLoadingOneWay] = useState(false);
  const [isLoadingRoundTrip, setIsLoadingRoundTrip] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
        setUserData(data);
      } catch (err: any) {
        console.log("API error fetching data", err);
        removeToken();
        // window.location.href = "/login"; // Redirect to login if unauthorized
      }
    };

    fetchUserData();
  }, []);
  const showLocation = () => {
    setDisplayForm(!displayForm);
  };
  const showMap = () => {
    setMap(!map);
  };
  const { toast } = useToast();
  const handleEmailQuote = async (vehicle, isRoundTrip = false) => {
    if (isRoundTrip) {
      setIsLoadingRoundTrip(true);
    } else {
      setIsLoadingOneWay(true);
    }
    const tripType = isRoundTrip ? "Round Trip" : "One Way";
    const price = isRoundTrip
      ? Number(vehicle.price) * 2
      : Number(vehicle.price);

    const emailData = {
      subject: `Quote for ${tripType} Transfer`,
      message: `
        <h2>Transfer Quote</h2>
        <p><strong>Trip Type:</strong> ${tripType}</p>
        <p><strong>Pickup:</strong> ${pickup}</p>
        <p><strong>Dropoff:</strong> ${dropoff}</p>
        <p><strong>Passengers:</strong> ${pax}</p>
        <p><strong>Date & Time:</strong> ${date} ${time}</p>
        ${
          isRoundTrip
            ? `<p><strong>Return Date & Time:</strong> ${returnDate} ${returnTime}</p>`
            : ""
        }
        <p><strong>Vehicle:</strong> ${vehicle.brand} - ${
        vehicle.vehicalType
      }</p>
        <p><strong>Price:</strong> ${vehicle.currency} ${price.toFixed(2)}</p>
        <p><strong>Source:</strong> ${vehicle.source}</p>
        <br/>
        <p>To confirm your booking, please reply to this email.</p>
      `,
      recipient: "gcaffe.ashish@gmail.com", // Replace with actual email recipient
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/sendEmail`,
        emailData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        // alert("Email sent successfully!");
        toast({
          title: "Email Quotation",
          description: "Email sent successfully!",
        });
      } else {
        // alert("Failed to send email. Please try again.");
        toast({
          title: "Email Quotation",
          description: "Failed to send email. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Email sending error:", error);
      // alert("Error sending email. Please check the console for details.");
      toast({
        title: "Error",
        description: `${error}`,
        variant: "destructive",
      });
    } finally {
      if (isRoundTrip) {
        setIsLoadingRoundTrip(false);
      } else {
        setIsLoadingOneWay(false);
      }
    }
  };

  const handleBookNow = (vehicle) => {
    if (!userData) {
          if (window.confirm("You need to log in to book a vehicle. Do you want to log in now?")) {
            window.location.href = "/login"; // Redirect to login page
          }
          return;
        }
    const bookingInfo = {
      pickup: formData.pickup,
      dropoff: formData.dropoff,
      pax: formData.pax,
      date: formData.date,
      time: formData.time,
      returnDate: formData.returnDate,
      returnTime: formData.returnTime,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      vehicle: {
        brand: vehicle.brand,
        vehicalType: vehicle.vehicalType,
        passengers: vehicle.passengers,
        mediumBag: vehicle.mediumBag,
        currency: vehicle.currency,
        price: Number(vehicle.price),
        source: vehicle.source,
      },
      extraCost: vehicle.extraCost || "0",
      tripType:
        formData.returnDate && formData.returnTime ? "Round Trip" : "One Way",
    };

    console.log("Selected Booking Info:", bookingInfo);
    onSelect(bookingInfo); // Send data to TransferMultiStepForm
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
                    <dt className="text-muted-foreground">
                      Return Date & Time
                    </dt>
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
                    <dd>{distance ? `${distance} Miles` : "N/A"}</dd> {/* Replace with actual data if available */}
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
                  <LocationMap
                    pickupLocation={pickupLocation}
                    dropoffLocation={dropoffLocation}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        {/* Vehicles Section */}
        <ScrollArea className="md:w-2/3 whitespace-nowrap rounded-md border">
        <h2 className="text-2xl px-4 pt-2">Available Vehicles</h2>
        {loading?(<div className="flex flex-col p-4 gap-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>):(
          <div className="flex flex-col gap-5 p-4 md:h-96">
          {vehicles.length > 0 ? (
            vehicles.map((vehicle, index) => (
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
                        <p>
                          {returnDate && returnTime
                            ? "Round Trip"
                            : "One Way"}
                        </p>
                        <h2 className="text-2xl font-medium">
                          {vehicle.currency}{" "}
                          {returnDate && returnTime
                            ? (Number(vehicle.price) * 2).toFixed(2) // Double the price for round trip
                            : Number(vehicle.price).toFixed(2)}
                        </h2>
                      </div>
                      <div>
                        {/* <Button
                          className="w-full"
                          onClick={() => handleBookNow(vehicle)}
                        >
                          Book Now
                        </Button> */}
                        <Button
                          className="w-full"
                          onClick={() => handleBookNow(vehicle)}
                          // disabled={!userData} // Disable if no user is logged in
                        >
                          {userData ? "Book Now" : "Login to Book"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="mr-1"
                    onClick={() => handleEmailQuote(vehicle, false)}
                    // disabled={isLoadingOneWay}
                    disabled={isLoadingOneWay || !userData} // Disable if no userData
                  >
                    {isLoadingOneWay ? "Sending..." : "Email Quote"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleEmailQuote(vehicle, true)}
                    // disabled={isLoadingRoundTrip}
                    disabled={isLoadingRoundTrip || !userData} // Disable if no userData
                  >
                    {isLoadingRoundTrip ? "Sending..." : "Round Trip Quote"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p>No vehicles available.</p>
          )}
        </div>
        )}
        </ScrollArea>
      </div>
    </>
  );
};

export default SearchResult;
