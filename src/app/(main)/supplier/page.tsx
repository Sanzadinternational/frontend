// import Login from "@/components/auth/Login";
import SupplierRegistration from "@/components/auth/SupplierRegistration";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
const AgentLoginRegistration = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-3">Supplier Registration</h1>
      <ScrollArea className="h-96">
        <SupplierRegistration/>
      </ScrollArea>
      {/* <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="login">Account</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login role="supplier"/>
        </TabsContent>
        <TabsContent value="register">
          <SupplierRegistration />
        </TabsContent>
      </Tabs> */}
    </div>
  );
};

export default AgentLoginRegistration;
