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
const SearchResult = ({
  onSelect,
  formData,
  vehicles,
  loading,
  distance,
  estimatedTime,
}) => {
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
    targetCurrency,
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
        console.log("userData",userData);
      } catch (err: any) {
        console.log("API error fetching data", err);
        removeToken();
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
      subject: `🚗 Transfer Quote for Your ${tripType} Trip`,
      message: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #007bff; text-align: center;">🚖 Transfer Quotation</h2>
          <p style="text-align: center; font-size: 16px; color: #555;">
            Here is your quotation for the requested ${tripType} transfer.
          </p>
  
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>🚗 Trip Type:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${tripType}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>📍 Pickup Location:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${pickup}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>📍 Dropoff Location:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${dropoff}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>👥 Passengers:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${pax}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>📅 Date & Time:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${date} ${time}</td>
            </tr>
            ${
              isRoundTrip
                ? `<tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>🔄 Return Date & Time:</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${returnDate} ${returnTime}</td>
                  </tr>`
                : ""
            }
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>🚘 Vehicle:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${
                vehicle.brand
              } - ${vehicle.vehicalType}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>💰 Price:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #28a745;">${
                vehicle.currency
              } ${price.toFixed(2)}</td>
            </tr>
          </table>
  
          <p style="margin-top: 15px; text-align: center;">
            <strong>✅ Ready to confirm?</strong><br/>
            Please reply to this email or contact our support team.
          </p>
  
          <div style="text-align: center; margin-top: 20px;">
            <a href="mailto:support@sanzadinternational.com" 
               style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
              📩 Confirm Your Booking
            </a>
          </div>
  
          <p style="text-align: center; font-size: 14px; color: #888; margin-top: 20px;">
            If you have any questions, feel free to contact us at 
            <a href="mailto:support@sanzadinternational.com" style="color: #007bff;">support@sanzadinternational.com</a>
          </p>
        </div>
      `,
      recipient: `${userData.Email}`, // Replace with actual email recipient
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/agent/QuickEmail`,
        emailData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Email Quotation",
          description: "📩 Email sent successfully!",
        });
      } else {
        toast({
          title: "Email Quotation",
          description: "⚠️ Failed to send email. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Email sending error:", error);
      toast({
        title: "Error",
        description: `❌ ${error}`,
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
      
      const currentUrl = window.location.href;
      window.location.href = `/login?redirect=${encodeURIComponent(
        currentUrl
      )}`;
      return;
    }
    // Allow only agents to book
    if (userData.role !== "agent") {
      toast({
        title: "Access Denied",
        description: "❌ Only agents can book vehicles.",
        variant: "destructive",
      });
      return;
    }
    const bookingInfo = {
      pickup: formData.pickup,
      dropoff: formData.dropoff,
      pax: formData.pax,
      date: formData.date,
      time: formData.time,
      returnDate: formData?.returnDate,
      returnTime: formData?.returnTime,
      pickup_location: formData.pickupLocation,
      pickup_lat: parseFloat(formData.pickupLocation.split(",")[0].trim()),
      pickup_lng: parseFloat(formData.pickupLocation.split(",")[1].trim()),
      drop_location: formData.dropoffLocation,
      drop_lat: parseFloat(formData.dropoffLocation.split(",")[0].trim()),
      drop_lng: parseFloat(formData.dropoffLocation.split(",")[1].trim()),
      distance_miles: `${distance}`,
      estimatedTime: `${estimatedTime}`,
      agent_id: `${userData.userId}`,
      targetCurrency:formData?.targetCurrency,
      agent_address:`${userData.Address}`,
      agent_city:`${userData.City}`,
      agent_country:`${userData.Country}`,
      agent_zipcode:`${userData.Zip_code}`,
      vehicle: {
        brand: vehicle.brand,
        currency: vehicle.currency,
        extraPricePerKm: vehicle.extraPricePerKm,
        mediumBag: vehicle.mediumBag,
        smallBag:vehicle.SmallBag,
        nightTime: vehicle.nightTime,
        nightTimePrice: vehicle.nightTimePrice,
        passengers: vehicle.passengers,
        price: Number(vehicle.price),
        suplier_id: vehicle.supplierId,
        transferInfo: vehicle.transferInfo,
        vehicalType: vehicle.vehicalType,
        vehicle_id: vehicle.vehicleId,
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
                    <dd>{estimatedTime ? `${estimatedTime}` : "N/A"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Distance</dt>
                    <dd>{distance ? `${distance} Miles` : "N/A"}</dd>
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
          {loading ? (
            <div className="flex flex-col p-4 gap-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="flex flex-col gap-5 p-4 md:h-96">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle, index) =>{
                  return (
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
                              "/Car-Mockup_Sanzad-International.webp"
                            } 
                            width={250}
                            height={100}
                            alt={vehicle.brand}
                            className="rounded-sm"
                          />
                          <div className="flex flex-col md:items-end justify-between">
                            <dl className="px-2 py-1 text-sm">
                              <div className="flex md:justify-end items-center gap-1">
                                <dt>Passengers</dt>
                                <dd>{vehicle.passengers}</dd>
                                <Users width={15} height={15} />
                              </div>
                              <div className="flex md:justify-end items-center gap-1">
                                <dt>Medium Bags</dt>
                                <dd>{vehicle.mediumBag}</dd>
                                <Luggage width={15} height={15} />
                              </div>
                              <div className="flex md:justify-end items-center gap-1">
                                <dt>Small Bags</dt>
                                <dd>{vehicle.SmallBag||"N/A"}</dd>
                                <Luggage width={15} height={15} />
                              </div>
                            </dl>
                            <HoverCard>
                              <HoverCardTrigger className="flex items-center text-blue-500 cursor-pointer">
                                <BadgeInfo width={15} height={15} />
                                Transfer Info
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80 text-wrap">
                                {vehicle.transferInfo || "No Info Available"}
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
                              {targetCurrency}{" "}
                              {returnDate && returnTime
                                ? (Number(vehicle.price) * 2).toFixed(2) 
                                : Number(vehicle.price).toFixed(2)}
                            </h2>
                          </div>
                          <div>
                            
                            <Button
                              className="w-full"
                              onClick={() => handleBookNow(vehicle)}
                              
                            >
                              {userData && userData.role === "agent"
                                ? "Book Now"
                                : "Agent Login to Book"}
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
                )})
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
