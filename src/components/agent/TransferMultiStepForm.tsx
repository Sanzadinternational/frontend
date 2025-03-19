"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

import SearchResult from "./SearchResult";
import { Progress } from "@/components/ui/progress";
import { Button } from "../ui/button";
import Booking from "./Booking";
import Confirm from "./Confirm";

const TransferMultiStepForm = () => {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [bookingInfo, setBookingInfo] = useState(null);

  // Extract query parameters
  const formData = {
    pickup: searchParams.get("pickup") || "",
    dropoff: searchParams.get("dropoff") || "",
    pax: searchParams.get("pax") || "",
    date: searchParams.get("date") || "",
    time: searchParams.get("time") || "",
    returnDate: searchParams.get("returnDate") || "",
    returnTime: searchParams.get("returnTime") || "",
    pickupLocation: searchParams.get("pickupLocation") || "",
    dropoffLocation: searchParams.get("dropoffLocation") || "",
  };
  
  // Call the search API using the query parameters
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/data/search`,
          formData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        setVehicles(response.data.data); // Store the vehicle data
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchParams]); // Re-run API call if search params change


  const totalSteps = 3; // Total number of steps
  // Custom step labels
  const stepLabels = ["Search Results", "Transfer Details", "Confirmation"];

  const handleBookingInfo = (info) => {
    console.log("Booking Info Set:", info);
    setBookingInfo(info);
    setStep(2); // ✅ Move to step 2 after selecting booking
  };

  // Step navigation
  const nextStep = () =>
    setStep((prevStep) => Math.min(prevStep + 1, totalSteps));
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  // Progress calculation
  const calculateProgress = () => ((step - 1) / (totalSteps - 1)) * 100;

  // Step components
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <SearchResult onSelect={handleBookingInfo} formData={formData} vehicles={vehicles} loading={loading}/>
            {/* <button type="button" onClick={nextStep}>
              Next
            </button> */}
          </>
        );
      case 2:
        return (
          <Booking bookingInfo={bookingInfo} nextStep={nextStep}/>
        );
      case 3:
        return (
          <Confirm bookingInfo={bookingInfo}/>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="relative w-3/4 mx-auto mt-6 h-5">
        {/* Progress Bar */}
        <Progress value={calculateProgress()} />

        {/* Step Indicators */}
        <div className="absolute inset-0 flex justify-between items-center">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber <= step;

            return (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  isCompleted ? "text-primary" : "text-gray-400"
                }`}
                style={{
                  left: `${(index / (stepLabels.length - 1)) * 100}%`,
                  transform: "translateX(-50%)",
                  position: "absolute",
                }}
              >
                {/* Circle */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isCompleted
                      ? "bg-primary border-primary text-white dark:text-black"
                      : "border-gray-400 bg-white dark:text-black"
                  }`}
                >
                  {stepNumber}
                </div>
                {/* Custom Label */}
                <span className="text-xs mt-1 whitespace-nowrap">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-6">{renderStep()}</div>
      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-center gap-2">
        <Button
          type="button"
          onClick={prevStep}
          className=""
          disabled={step === 1}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={nextStep}
          className=""
          disabled={step === totalSteps}
        >
          Next
        </Button>
      </div>
      </>
  );
};

export default TransferMultiStepForm;
