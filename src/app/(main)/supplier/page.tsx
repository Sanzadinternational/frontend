import SupplierRegistration from "@/components/auth/SupplierRegistration";
import { ScrollArea } from "@/components/ui/scroll-area";

const AgentLoginRegistration = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      {/* <h1 className="text-3xl font-bold mb-3">Supplier Registration</h1> */}
      {/* <ScrollArea className="h-96"> */}
        <SupplierRegistration/>
      {/* </ScrollArea> */}
    </div>
  );
};

export default AgentLoginRegistration;
