import Login from "@/components/auth/Login";
import SupplierRegistration from "@/components/auth/SupplierRegistration";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
const AgentLoginRegistration = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-3">Supplier Login</h1>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="login">Account</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="register">
          <SupplierRegistration />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentLoginRegistration;
