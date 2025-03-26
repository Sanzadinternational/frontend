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
// import TransferMultiStepForm from "@/components/agent/TransferMultiStepForm";
import Location from "@/components/Location";

const features = [
  {
    title: "No Extra",
    description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat provident perferendis voluptatibus.`,
  },
  {
    title: "Free Cancelation",
    description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat provident perferendis voluptatibus.`,
  },
  {
    title: "Free Rides",
    description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat provident perferendis voluptatibus.`,
  },
  {
    title: "Safe Rides",
    description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat provident perferendis voluptatibus.`,
  },
];
export default function Home() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 py-2 px-5 mx-10 my-4 z-[-1] rounded-md bg-slate-100 dark:bg-primary dark:text-black">
        <div className="py-4 px-5">
          <h1 className="">Sanzad International</h1>
          <p className="text-3xl md:text-6xl font-bold">
            Transfer Rides In All Countries
          </p>
          <Button className="my-2 bg-blue-500 dark:bg-card-foreground">
            Contact
          </Button>
        </div>
        <div className="flex justify-center">
          <Image
            src="/Transfer-Rides_Sanzad-International.webp"
            alt="Hero Image"
            width={250}
            height={250}
          />
        </div>
      </div>
      <div className="flex justify-center mt-[-80px]">
        <Location />
      </div>
      {/* <div className="mx-10 mt-20">
      <TransferMultiStepForm/>
      </div> */}
      <div className="flex flex-col md:grid grid-cols-2 gap-5 mt-20 mb-20 px-10">
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
        <div className=" flex flex-col md:grid grid-cols-2 gap-3">
          {features.map((feature, id) => (
            <Card key={id}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
        </div>
      </div>
    </>
  );
}
