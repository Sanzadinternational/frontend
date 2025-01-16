"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Vehicle } from "@/app/(dashboard)/dashboard/supplier/vehicles/page";

export default function EditVehicleForm({
  vehicle,
  onSave,
  onCancel,
}: {
  vehicle: Vehicle;
  onSave: (updatedVehicle: Vehicle) => Promise<void>;
  onCancel: () => void;
}) {
  // Initialize the form with default values from the `vehicle` object
  const { register, handleSubmit, reset } = useForm<Vehicle>({
    defaultValues: vehicle, // Prepopulate form with data
  });
console.log(vehicle);
   // Reset form values whenever the vehicle data changes
   useEffect(() => {
    reset(vehicle); // Ensure the form updates when a new `vehicle` is passed
  }, [vehicle, reset]);
  const handleSave = async (data: Vehicle) => {
    await onSave(data);
  };

  return (
    <div className="p-4 border rounded shadow-lg bg-white">
    <h3 className="text-lg font-bold mb-4">Edit Vehicle</h3>
    <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
      {/* Vehicle Type Field */}
      <div>
        <label className="block text-sm font-medium">Vehicle Type</label>
        <input
          {...register("vehicleType")}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Country Field */}
      <div>
        <label className="block text-sm font-medium">Country</label>
        <input
          {...register("country")}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* City Field */}
      <div>
        <label className="block text-sm font-medium">City</label>
        <input
          {...register("city")}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Service Type Field */}
      <div>
        <label className="block text-sm font-medium">Service Type</label>
        <input
          {...register("serviceType")}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Date Range Fields */}
      <div>
        <label className="block text-sm font-medium">Date Range From</label>
        <input
          type="date"
          {...register("dateRange.from")}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Date Range To</label>
        <input
          type="date"
          {...register("dateRange.to")}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Actions */}
      <button type="submit" className="btn btn-primary">
        Save
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="btn btn-secondary ml-2"
      >
        Cancel
      </button>
    </form>
  </div>
  );
}
