"use client";

import TransferMultiStepForm from "@/components/agent/TransferMultiStepForm";
import DashboardContainer from "@/components/layout/DashboardContainer";
import { Suspense } from "react";

const Page = () => {
  return (
    <DashboardContainer scrollable>
      <TransferMultiStepForm />
    </DashboardContainer>
  );
};

export default Page;
