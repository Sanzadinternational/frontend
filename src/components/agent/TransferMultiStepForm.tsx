"use client";
import { useState } from "react";
import SearchResult from "./SearchResult";
import { Progress } from "@/components/ui/progress";
import { Button } from "../ui/button";
import Booking from "./Booking";
import Confirm from "./Confirm";

const TransferMultiStepForm = () => {
  const [step, setStep] = useState(1);
  // const [formData, setFormData] = useState({
  //   carModel: "",
  //   carYear: "",
  //   ownerName: "",
  //   ownerEmail: "",
  //   paymentMethod: "",
  //   paymentAmount: "",
  // });

  const totalSteps = 3; // Total number of steps
  // Custom step labels
  const stepLabels = ["Search Results", "Transfer Details", "Confirmation"];
  // Handle form field changes
  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

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
            <SearchResult />
            {/* <button type="button" onClick={nextStep}>
              Next
            </button> */}
          </>
        );
      case 2:
        return (
          <Booking/>
        );
      case 3:
        return (
          <Confirm/>
          // <div>
          //   <h2>Step 3: Payment Details</h2>
          //   <div>
          //     <label>Payment Method:</label>
          //     <input
          //       type="text"
          //       name="paymentMethod"
          //       value={formData.paymentMethod}
          //       onChange={handleChange}
          //       required
          //     />
          //   </div>
          //   <div>
          //     <label>Payment Amount:</label>
          //     <input
          //       type="number"
          //       name="paymentAmount"
          //       value={formData.paymentAmount}
          //       onChange={handleChange}
          //       required
          //     />
          //   </div>
          //   <button type="button" onClick={prevStep}>
          //     Back
          //   </button>
          //   <button type="submit" onClick={handleSubmit}>
          //     Submit
          //   </button>
          // </div>
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
