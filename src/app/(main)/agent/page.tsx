import AgentRegistration from "@/components/auth/AgentRegistration";
// import Login from "@/components/auth/Login";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
const AgentLoginRegistration = () => {
  return (
    
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-3">Agent Registration</h1>
      <ScrollArea className="h-96">
      <AgentRegistration />
      </ScrollArea>
      {/* <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="login">Account</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login role="agent"/>
        </TabsContent>
        <TabsContent value="register">
          <AgentRegistration />
        </TabsContent>
      </Tabs> */}
    </div>
  );
};

export default AgentLoginRegistration;
