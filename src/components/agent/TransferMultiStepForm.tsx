// "use client";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { fetchWithAuth } from "../utils/api";
// import { removeToken } from "../utils/auth";
// import SearchResult from "./SearchResult";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "../ui/button";
// import Booking from "./Booking";
// import Confirm from "./Confirm";

// const TransferMultiStepForm = () => {
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const data = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//         setUser(data);
//         console.log("userData",data);
//       } catch (err: any) {
//         console.log("API error fetching data", err);
//         removeToken();
//       }
//     };

//     fetchUserData();
//   }, []);
//   const searchParams = useSearchParams();
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [step, setStep] = useState(1);
//   const [bookingInfo, setBookingInfo] = useState(null);
//   const [distance, setDistance] = useState(null);
//   const [estimatedTime, setEstimatedTime]= useState(null);
//   const [user,setUser] = useState();
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   // Extract query parameters
//   const formData = {
//     pickup: searchParams.get("pickup") || "",
//     dropoff: searchParams.get("dropoff") || "",
//     pax: searchParams.get("pax") || "",
//     date: searchParams.get("date") || "",
//     time: searchParams.get("time") || "",
//     returnDate: searchParams.get("returnDate") || "",
//     returnTime: searchParams.get("returnTime") || "",
//     pickupLocation: searchParams.get("pickupLocation") || "",
//     dropoffLocation: searchParams.get("dropoffLocation") || "",
//     targetCurrency:user?.Currency,
//   };
  
//   // Call the search API using the query parameters
//   useEffect(() => {
//     const fetchVehicles = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.post(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/data/search`,
//           formData,
//           {
//             headers: { "Content-Type": "application/json" },
//           }
//         );

//         setVehicles(response.data.data); // Store the vehicle data
//         console.log(response.data.data);        setDistance(response.data.distance);
//         setEstimatedTime(response.data.estimatedTime);
//       } catch (error) {
//         console.error("Error fetching vehicles:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVehicles();
//   }, [searchParams]); // Re-run API call if search params change


//   const totalSteps = 3; // Total number of steps
//   // Custom step labels
//   const stepLabels = ["Search Results", "Transfer Details", "Confirmation"];

//   const handleBookingInfo = (info) => {
//     console.log("Booking Info Set:", info);
//     setBookingInfo(info);
//     setStep(2); // ✅ Move to step 2 after selecting booking
//   };

//   // Step navigation
//   const nextStep = () =>
//     setStep((prevStep) => Math.min(prevStep + 1, totalSteps));
//   const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

//   // Progress calculation
//   const calculateProgress = () => ((step - 1) / (totalSteps - 1)) * 100;

//   // Step components
//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <>
//             <SearchResult onSelect={handleBookingInfo} formData={formData} vehicles={vehicles} loading={loading} distance={distance} estimatedTime={estimatedTime}/>
//             {/* <button type="button" onClick={nextStep}>
//               Next
//             </button> */}
//           </>
//         );
//       case 2:
//         return (
//           <Booking bookingInfo={bookingInfo} setBookingInfo={setBookingInfo}nextStep={nextStep}/>
//         );
//       case 3:
//         return (
//           <Confirm bookingInfo={bookingInfo}/>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       <div className="relative w-3/4 mx-auto mt-6 h-5">
//         {/* Progress Bar */}
//         <Progress value={calculateProgress()} />

//         {/* Step Indicators */}
//         <div className="absolute inset-0 flex justify-between items-center">
//           {stepLabels.map((label, index) => {
//             const stepNumber = index + 1;
//             const isCompleted = stepNumber <= step;

//             return (
//               <div
//                 key={index}
//                 className={`flex flex-col items-center ${
//                   isCompleted ? "text-primary" : "text-gray-400"
//                 }`}
//                 style={{
//                   left: `${(index / (stepLabels.length - 1)) * 100}%`,
//                   transform: "translateX(-50%)",
//                   position: "absolute",
//                 }}
//               >
//                 {/* Circle */}
//                 <div
//                   className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
//                     isCompleted
//                       ? "bg-primary border-primary text-white dark:text-black"
//                       : "border-gray-400 bg-white dark:text-black"
//                   }`}
//                 >
//                   {stepNumber}
//                 </div>
//                 {/* Custom Label */}
//                 <span className="text-xs mt-1 whitespace-nowrap">{label}</span>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//       <div className="mt-6">{renderStep()}</div>
//       {/* Navigation Buttons */}
//       {/* <div className="mt-6 flex justify-center gap-2"> */}
//         {/* <Button
//           type="button"
//           onClick={prevStep}
//           className=""
//           disabled={step === 1}
//         >
//           Back
//         </Button> */}
//         {/* <Button
//           type="button"
//           onClick={nextStep}
//           className=""
//           disabled={step === totalSteps}
//         >
//           Next
//         </Button> */}
//       {/* </div> */}
//       </>
//   );
// };

// export default TransferMultiStepForm;



// "use client";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { fetchWithAuth } from "../utils/api";
// import { removeToken } from "../utils/auth";
// import SearchResult from "./SearchResult";
// import { Progress } from "@/components/ui/progress";
// // import { Button } from "../ui/button";
// import Booking from "./Booking";
// import Confirm from "./Confirm";

// const TransferMultiStepForm = () => {
//   const searchParams = useSearchParams();
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [step, setStep] = useState(1);
//   const [bookingInfo, setBookingInfo] = useState(null);
//   const [distance, setDistance] = useState(null);
//   const [estimatedTime, setEstimatedTime] = useState(null);
//   const [user, setUser] = useState(null);
//   const [targetCurrency, setTargetCurrency] = useState("INR"); // Default to INR
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//   // Fetch user data
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const data = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//         setUser(data);
//         if (data?.Currency) {
//           setTargetCurrency(data.Currency);
//         }
//       } catch (err) {
//         console.error("API error fetching user data (using INR as default)", err);
//         removeToken();
//       }
//     };
//     fetchUserData();
//   }, []);

//   // Form data from URL params
//   const formData = {
//     pickup: searchParams.get("pickup") || "",
//     dropoff: searchParams.get("dropoff") || "",
//     pax: searchParams.get("pax") || "",
//     date: searchParams.get("date") || "",
//     time: searchParams.get("time") || "",
//     returnDate: searchParams.get("returnDate") || "",
//     returnTime: searchParams.get("returnTime") || "",
//     pickupLocation: searchParams.get("pickupLocation") || "",
//     dropoffLocation: searchParams.get("dropoffLocation") || "",
//     targetCurrency: targetCurrency // Use the state value
//   };

//   // Fetch vehicles
//   useEffect(() => {
//     const fetchVehicles = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.post(
//           `${API_BASE_URL}/data/search`,
//           formData,
//           { headers: { "Content-Type": "application/json" } }
//         );
//         setVehicles(response.data.data);
//         setDistance(response.data.distance);
//         setEstimatedTime(response.data.estimatedTime);
//       } catch (error) {
//         console.error("Error fetching vehicles:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVehicles();
//   }, [searchParams, targetCurrency]); // Re-run when search params or currency changes

//   const totalSteps = 3;
//   const stepLabels = ["Search Results", "Transfer Details", "Confirmation"];

//   const handleBookingInfo = (info) => {
//     setBookingInfo(info);
//     setStep(2);
//   };

//   const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
//   const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
//   const calculateProgress = () => ((step - 1) / (totalSteps - 1)) * 100;

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <SearchResult 
//             onSelect={handleBookingInfo} 
//             formData={formData} 
//             vehicles={vehicles} 
//             loading={loading} 
//             distance={distance} 
//             estimatedTime={estimatedTime}
//           />
//         );
//       case 2:
//         return (
//           <Booking 
//             bookingInfo={bookingInfo} 
//             setBookingInfo={setBookingInfo}
//             nextStep={nextStep}
//           />
//         );
//       case 3:
//         return <Confirm bookingInfo={bookingInfo} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       <div className="relative w-3/4 mx-auto mt-6 h-5">
//         <Progress value={calculateProgress()} />
//         <div className="absolute inset-0 flex justify-between items-center">
//           {stepLabels.map((label, index) => {
//             const stepNumber = index + 1;
//             const isCompleted = stepNumber <= step;

//             return (
//               <div
//                 key={index}
//                 className={`flex flex-col items-center ${
//                   isCompleted ? "text-primary" : "text-gray-400"
//                 }`}
//                 style={{
//                   left: `${(index / (stepLabels.length - 1)) * 100}%`,
//                   transform: "translateX(-50%)",
//                   position: "absolute",
//                 }}
//               >
//                 <div
//                   className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
//                     isCompleted
//                       ? "bg-primary border-primary text-white dark:text-black"
//                       : "border-gray-400 bg-white dark:text-black"
//                   }`}
//                 >
//                   {stepNumber}
//                 </div>
//                 <span className="text-xs mt-1 whitespace-nowrap">{label}</span>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//       <div className="mt-6">{renderStep()}</div>
//     </>
//   );
// };

// export default TransferMultiStepForm;



// "use client";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { fetchWithAuth } from "../utils/api";
// import { removeToken } from "../utils/auth";
// import SearchResult from "./SearchResult";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "../ui/button";
// import Booking from "./Booking";
// import Confirm from "./Confirm";

// const TransferMultiStepForm = () => {
//   const searchParams = useSearchParams();
//   const [vehicles, setVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [step, setStep] = useState(1);
//   const [bookingInfo, setBookingInfo] = useState(null);
//   const [distance, setDistance] = useState(null);
//   const [estimatedTime, setEstimatedTime] = useState(null);
//   const [user, setUser] = useState(null);
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//   // Extract query parameters
//   const formData = {
//     pickup: searchParams.get("pickup") || "",
//     dropoff: searchParams.get("dropoff") || "",
//     pax: searchParams.get("pax") || "",
//     date: searchParams.get("date") || "",
//     time: searchParams.get("time") || "",
//     returnDate: searchParams.get("returnDate") || "",
//     returnTime: searchParams.get("returnTime") || "",
//     pickupLocation: searchParams.get("pickupLocation") || "",
//     dropoffLocation: searchParams.get("dropoffLocation") || "",
//     targetCurrency: user?.Currency || "INR",
//   };

//   // Fetch user data
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const data = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
//         setUser(data);
//       } catch (err) {
//         console.error("API error fetching user data", err);
//         removeToken();
//       }
//     };
//     fetchUserData();
//   }, []);

//   // Fetch vehicles
//   useEffect(() => {
//     const fetchVehicles = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.post(
//           `${API_BASE_URL}/data/search`,
//           formData,
//           { headers: { "Content-Type": "application/json" } }
//         );
//         setVehicles(response.data.data);
//         setDistance(response.data.distance);
//         setEstimatedTime(response.data.estimatedTime);
//       } catch (error) {
//         console.error("Error fetching vehicles:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVehicles();
//   }, [searchParams, user?.Currency]);

//   const totalSteps = 3;
//   const stepLabels = ["Search Results", "Transfer Details", "Confirmation"];

//   const handleBookingInfo = (info) => {
//     setBookingInfo(info);
//     setStep(2);
//   };

//   const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
//   const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
//   const calculateProgress = () => ((step - 1) / (totalSteps - 1)) * 100;

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <SearchResult 
//             onSelect={handleBookingInfo} 
//             formData={formData} 
//             vehicles={vehicles} 
//             loading={loading} 
//             distance={distance} 
//             estimatedTime={estimatedTime}
//           />
//         );
//       case 2:
//         return (
//           <Booking 
//             bookingInfo={bookingInfo} 
//             setBookingInfo={setBookingInfo}
//             nextStep={nextStep}
//           />
//         );
//       case 3:
//         return <Confirm bookingInfo={bookingInfo} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//       <div className="relative w-3/4 mx-auto mt-6 h-5">
//         <Progress value={calculateProgress()} />
//         <div className="absolute inset-0 flex justify-between items-center">
//           {stepLabels.map((label, index) => {
//             const stepNumber = index + 1;
//             const isCompleted = stepNumber <= step;

//             return (
//               <div
//                 key={index}
//                 className={`flex flex-col items-center ${
//                   isCompleted ? "text-primary" : "text-gray-400"
//                 }`}
//                 style={{
//                   left: `${(index / (stepLabels.length - 1)) * 100}%`,
//                   transform: "translateX(-50%)",
//                   position: "absolute",
//                 }}
//               >
//                 <div
//                   className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
//                     isCompleted
//                       ? "bg-primary border-primary text-white dark:text-black"
//                       : "border-gray-400 bg-white dark:text-black"
//                   }`}
//                 >
//                   {stepNumber}
//                 </div>
//                 <span className="text-xs mt-1 whitespace-nowrap">{label}</span>
//               </div>
//             );
//           })}
//         </div>
//       </div>
      
//       <div className="mt-6">{renderStep()}</div>

//       {/* Navigation Buttons */}
//       {/* <div className="mt-6 flex justify-center gap-4">
//         Show Previous button only on step 2
//         {step === 2 && (
//           <Button
//             type="button"
//             onClick={prevStep}
//             variant="outline"
//             className="px-6"
//           >
//             Previous
//           </Button>
//         )}
        
//         Show Next button only on step 1
//         {step === 1 && (
//           <Button
//             type="button"
//             onClick={nextStep}
//             className="px-6"
//           >
//             Next
//           </Button>
//         )}
//       </div> */}
//     </>
//   );
// };

// export default TransferMultiStepForm;




"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchWithAuth } from "../utils/api";
import { removeToken } from "../utils/auth";
import SearchResult from "./SearchResult";
import { Progress } from "@/components/ui/progress";
import { Button } from "../ui/button";
import Booking from "./Booking";
import Confirm from "./Confirm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChooseCurrency } from "../constants/currency";
const chooseCurrency = ChooseCurrency;
const TransferMultiStepForm = () => {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [distance, setDistance] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    targetCurrency: selectedCurrency, // Use the selectedCurrency state
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchWithAuth(`${API_BASE_URL}/dashboard`);
        setUser(data);
        // Set initial currency to user's currency if available
        if (data?.Currency) {
          setSelectedCurrency(data.Currency);
        }
      } catch (err) {
        console.error("API error fetching user data", err);
        removeToken();
      }
    };
    fetchUserData();
  }, []);

  // Fetch vehicles when searchParams or currency changes
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_BASE_URL}/data/search`,
          formData,
          { headers: { "Content-Type": "application/json" } }
        );
        setVehicles(response.data.data);
        setDistance(response.data.distance);
        setEstimatedTime(response.data.estimatedTime);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchParams, selectedCurrency]); // Add selectedCurrency to dependencies

  const handleCurrencyChange = (value) => {
    setSelectedCurrency(value);
  };

  const totalSteps = 3;
  const stepLabels = ["Search Results", "Transfer Details", "Confirmation"];

  const handleBookingInfo = (info) => {
    setBookingInfo(info);
    setStep(2);
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const calculateProgress = () => ((step - 1) / (totalSteps - 1)) * 100;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <div className="mb-4 flex justify-end">
              <Select onValueChange={handleCurrencyChange} value={selectedCurrency}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {chooseCurrency.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <SearchResult 
              onSelect={handleBookingInfo} 
              formData={formData} 
              vehicles={vehicles} 
              loading={loading} 
              distance={distance} 
              estimatedTime={estimatedTime}
            />
          </div>
        );
      case 2:
        return (
          <Booking 
            bookingInfo={bookingInfo} 
            setBookingInfo={setBookingInfo}
            nextStep={nextStep}
            // selectedCurrency={selectedCurrency}
          />
        );
      case 3:
        return <Confirm bookingInfo={bookingInfo} 
        // selectedCurrency={selectedCurrency} 
        />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="relative w-3/4 mx-auto mt-6 h-5">
        <Progress value={calculateProgress()} />
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
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isCompleted
                      ? "bg-primary border-primary text-white dark:text-black"
                      : "border-gray-400 bg-white dark:text-black"
                  }`}
                >
                  {stepNumber}
                </div>
                <span className="text-xs mt-1 whitespace-nowrap">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-6">{renderStep()}</div>
    </>
  );
};

export default TransferMultiStepForm;