"use client";
import { useState } from "react";
import SearchResult from "./SearchResult";
import { Progress } from "@/components/ui/progress";
import { Button } from "../ui/button";
import Booking from "./Booking";
import Confirm from "./Confirm";

const TransferMultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [bookingInfo, setBookingInfo] = useState(null);

  const totalSteps = 3; // Total number of steps
  // Custom step labels
  const stepLabels = ["Search Results", "Transfer Details", "Confirmation"];

  const handleBookingInfo = (info) => {
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
            <SearchResult onSelect={handleBookingInfo}/>
            {/* <button type="button" onClick={nextStep}>
              Next
            </button> */}
          </>
        );
      case 2:
        return (
          <Booking bookingInfo={bookingInfo}/>
        );
      case 3:
        return (
          <Confirm bookingInfo={bookingInfo}/>
        );
      default:
        return null;
    }
  };

  // // Handle form submission
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Form submitted:", formData);
  //   // Optionally, you can reset the form or navigate to a success page.
  // };

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
                      ? "bg-primary border-primary text-white"
                      : "border-gray-400 bg-white"
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
