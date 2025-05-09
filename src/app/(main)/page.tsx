import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Location from "@/components/Location";
import Link from "next/link";
import { features } from "@/components/constants/features";
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
            <Link href="/contact">Contact</Link>
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
      <div
        id="about"
        className="flex flex-col items-center gap-5 mt-20 px-10"
      >
        <div className="w-full flex flex-col items-center gap-1">
          <h2 className="text-muted-foreground text-xl">About Us</h2>
          <h3 className="text-2xl md:text-4xl font-semibold text-center">We&apos;re Wholesale Destination <br/>Management Tour Operators</h3>
          <p className="md:w-1/2 text-muted-foreground text-center">We provide packages for Groups, FITs, Van Tours, MICE & Leisure Tours to Travel Agents for Europe, UK, USA, South America, Central America & Canada.</p>
        </div>
        <div className="w-full flex flex-col md:flex-row justify-between bg-slate-100 md:h-[500px] rounded-md">
          <div className="flex flex-col justify-center px-4 md:pl-10 py-10 gap-5 md:w-2/3">
            <h3 className="text-2xl font-semibold">Founders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Card className="">
              <CardHeader>
                <CardTitle>Kaizad Gazdar</CardTitle>
                <CardDescription>Global CEO</CardDescription>
              </CardHeader>
              <CardContent>
                <p>WIth 24+ years of experience spread over managing operations, customer care and customer retention he also operated outbound process for European vacation rental market with expertise in designing, implementing and managing customer-oriented system.</p>
              </CardContent>
            </Card>
            <Card className="">
              <CardHeader>
                <CardTitle>Riya Gazdar</CardTitle>
                <CardDescription>Managing Director</CardDescription>
              </CardHeader>
              <CardContent>
                <p>With over 22 years in the travel industry, with B2B online brands like Ezeego1 and Ottila International, she specializes in global accommodation procurement and oversee travel operations and sales for leisure and corporate sectors. She also has an extensive network of international suppliers and tourism organizations</p>
              </CardContent>
            </Card>
            </div>
          </div>
          <div className="md:w-1/3 relative">
            <Image src='/Kaizad Gazdar & Riya Gazdar-Founder Sanzad International.svg' alt="Founders" width={400} height={400} className="md:absolute bottom-0 right-0"/>
          </div>
        
        </div>
      </div>
      <div id="features" className="flex flex-col md:flex-row gap-5 mt-10 mb-20 px-10">
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
    </>
  );
}
