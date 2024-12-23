import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TransferMultiStepForm from "@/components/agent/TransferMultiStepForm";

// import bg from "../../public/Sanzad-International-Hero_Image.jpg";
const features = [
  {
  title:'No Extra Charge',
  description:`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat provident perferendis voluptatibus.`,
},
{
  title:'Free Cancelation',
  description:`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat provident perferendis voluptatibus.`,
},
{
  title:'Free Rides',
  description:`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat provident perferendis voluptatibus.`,
},
{
  title:'Safe Rides',
  description:`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat provident perferendis voluptatibus.`,
},
]
export default function Home() {
  return (
    <>
      <div
        className="relative py-2 px-5 mx-10 my-4 rounded-md h-[400px] bg-slate-100 dark:bg-primary dark:text-black"
        // style={{
        //   backgroundImage: `url(${bg.src})`,
        //   backgroundSize: "cover",
        //   backgroundRepeat: "no-repeat",
        //   backgroundPosition:"center",
        // }}
      >
        <div className="text-center md:text-left md:absolute md:top-10 md:left-10 w-[450px] h-[200px]">
          <h1 className="text-3xl font-bold">Sanzad International</h1>
          <p>Transfer Rides in all Country</p>
          <Button className="my-2">Contact</Button>
        </div>
        <div className="absolute right-0 top-[-10px] hidden md:block">
          <Image src="/SANZAD_INTERNATIONAL.png" alt="Hero Image" width={350} height={350}/>
        </div>
        <div className="flex justify-center w-full h-[300px] absolute md:bottom-[-200px] left-0">
          <div className="w-[80%] bg-blue-100/[.5] rounded-md px-4 py-2">
            <h2 className="text-center text-2xl font-medium">Book Your Rides</h2>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:grid grid-cols-2 gap-5 mt-60 mb-20 px-10">
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            {/* <CardDescription>Card Description</CardDescription> */}
          </CardHeader>
          <CardContent>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat
              provident perferendis voluptatibus. Maiores odit accusantium
              necessitatibus eum voluptates, numquam sint sunt quibusdam,
              laboriosam a, debitis voluptatibus ab aliquam ipsum aspernatur.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Connect</Button>
          </CardFooter>
        </Card>
        <div className="grid grid-cols-2 gap-3">
          {
            features.map((feature,id)=>(
              <Card key={id}>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))
          }
        </div>
      </div>
      <div className="mx-10">
      <TransferMultiStepForm/>
      </div>
    </>
  );
}
