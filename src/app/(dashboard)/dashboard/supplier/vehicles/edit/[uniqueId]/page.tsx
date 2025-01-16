"use client";

// import { useRouter } from "next/router";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPage({ params }: { params: { uniqueId: string } }) {
//   const router = useRouter();
const { uniqueId } = params;
console.log(params);
  //  const { uniqueId } = router.query; // Get the uniqueId from the URL
//   const uniqueId = router.query?.uniqueId as string; // Extract `uniqueId` parameter
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uniqueId) return; // Ensure uniqueId is available
    const fetchVehicleData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/V1/supplier/GetVehicleCarDetails/${uniqueId}`
        );
        if (!response.ok) throw new Error("Failed to fetch vehicle details");
        const data = await response.json();
        setVehicle(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [uniqueId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Edit Vehicle Details</h1>
      <pre>{JSON.stringify(vehicle, null, 2)}</pre>
      {/* Add your edit form here */}
    </div>
  );
}
