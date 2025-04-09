import { Separator } from "@/components/ui/separator"
import { MapPin,Headset } from "lucide-react"

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-10 bg-blue-100/[.5] dark:bg-blend-darken dark:text-primary-foreground mx-10 px-5 py-5">
        <div className="flex flex-col items-center">
            <h2 className="text-xl">Contact Us</h2>
            <h1 className="text-3xl text-center">Looking To Get In Touch?
                <br/>
                We&#39;re Here to Help.
            </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col justify-between h-[300px]">
                <div>
                    <Headset width={20} height={20}/>
                    <h3 className="text-lg mt-1">Agent Support</h3>
                    <p className="w-2/3">Get help with your account or other queries</p>
                </div>
                <div className="">
                    <h4>support@sanzadinternational.com</h4>
                    <h4>+91XXXXXXXXXXX</h4>
                </div>
            </div>
            
            <div className="flex">
                <Separator className="mr-5 hidden md:block" orientation="vertical"/>
            <div className="flex flex-col justify-between h-[300px]">
                <div className="">
                    <Headset width={20} height={20}/>
                    <h3 className="text-lg mt-1">Supplier Support</h3>
                    <p className="w-2/3">Get help with your account or other queries</p>
                </div>
                <div className="">
                    <h4>support@sanzadinternational.com</h4>
                    <h4>+91XXXXXXXXXXX</h4>
                </div>
            </div>
            <Separator className="hidden md:block" orientation="vertical"/>
            </div>
            <div className="flex flex-col justify-between h-[300px]">
                <div className="">
                    <MapPin width={20} height={20}/>
                    <h3 className="text-lg mt-1">Find Us</h3>
                    <p className="w-2/3">Get help with your account or other queries</p>
                </div>
                <div className="">
                    <h4>support@sanzadinternational.com</h4>
                    <h4>+91XXXXXXXXXXX</h4>
                </div>
            </div>
        </div>
    </div>
  )
}

export default page